<?php

namespace App\Http\Controllers\Api;

use App\Models\CoverLetter;
use Illuminate\Http\Request;
use GuzzleHttp\Client;

class CoverLetterController
{
    public function generate(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string',
            'position_title' => 'required|string',
            'company_info' => 'string|nullable',
            'job_description' => 'string|nullable',
            'application_id' => 'integer|nullable',
        ]);

        $client = new Client();

        try {
            $response = $client->post(env('ML_SERVICE_URL') . '/api/generate-cover-letter', [
                'json' => [
                    'company_name' => $request->company_name,
                    'position_title' => $request->position_title,
                    'user_profile' => [
                        'name' => $request->user()->name,
                        'role' => $request->user()->current_role,
                        'skills' => $request->user()->skills,
                    ],
                    'company_info' => $request->company_info,
                    'job_description' => $request->job_description,
                ]
            ]);

            $letterData = json_decode($response->getBody(), true);

            $coverLetter = $request->user()->coverLetters()->create([
                'company_name' => $request->company_name,
                'position_title' => $request->position_title,
                'content' => $letterData['content'] ?? '',
                'tone' => $letterData['tone'] ?? 'professional',
                'application_id' => $request->application_id,
            ]);

            return response()->json([
                'message' => 'Cover letter generated successfully',
                'coverLetter' => $coverLetter,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to generate cover letter',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function listLetters(Request $request)
    {
        $letters = $request->user()
            ->coverLetters()
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($letters);
    }

    public function getLetter(Request $request, CoverLetter $coverLetter)
    {
        if ($coverLetter->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($coverLetter);
    }
}
