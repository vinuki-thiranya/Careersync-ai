<?php

namespace App\Http\Controllers\Api;

use App\Models\ResumeAnalysis;
use Illuminate\Http\Request;
use GuzzleHttp\Client;

class ResumeController
{
    public function analyze(Request $request)
    {
        $request->validate([
            'resume_text' => 'required|string',
            'job_description' => 'string|nullable',
        ]);

        $client = new Client();

        try {
            $response = $client->post(env('ML_SERVICE_URL') . '/api/analyze-resume', [
                'json' => [
                    'resume_text' => $request->resume_text,
                    'job_description' => $request->job_description,
                ]
            ]);

            $analysisData = json_decode($response->getBody(), true);

            // Save analysis to database
            $analysis = $request->user()->resumeAnalyses()->create([
                'resume_text' => $request->resume_text,
                'ats_score' => $analysisData['ats_score'] ?? 0,
                'keyword_gaps' => $analysisData['keyword_gaps'] ?? [],
                'skills_match_percentage' => $analysisData['skills_match_percentage'] ?? 0,
                'formatting_issues' => $analysisData['formatting_issues'] ?? [],
                'recommendations' => $analysisData['recommendations'] ?? [],
            ]);

            return response()->json([
                'message' => 'Resume analyzed successfully',
                'analysis' => $analysis,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to analyze resume',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function listAnalyses(Request $request)
    {
        $analyses = $request->user()
            ->resumeAnalyses()
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($analyses);
    }

    public function getAnalysis(Request $request, ResumeAnalysis $analysis)
    {
        if ($analysis->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($analysis);
    }
}
