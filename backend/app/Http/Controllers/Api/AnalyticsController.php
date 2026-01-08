<?php

namespace App\Http\Controllers\Api;

use App\Models\Application;
use Illuminate\Http\Request;

class AnalyticsController
{
    public function getDashboard(Request $request)
    {
        $user = $request->user();
        $applications = $user->applications;

        // Calculate funnel metrics
        $applied = $applications->where('status', 'applied')->count();
        $reviewing = $applications->where('status', 'reviewing')->count();
        $interview = $applications->where('status', 'interview')->count();
        $offers = $applications->where('status', 'offer')->count();
        $rejected = $applications->where('status', 'rejected')->count();

        // Calculate conversion rates
        $total = $applications->count();
        $applicationToResponseRate = $total > 0 ? (($reviewing + $interview + $offers) / $total) * 100 : 0;
        $responseToInterviewRate = ($reviewing + $interview) > 0 ? ($interview / ($reviewing + $interview)) * 100 : 0;
        $interviewToOfferRate = $interview > 0 ? ($offers / $interview) * 100 : 0;

        // Calculate average times in each stage
        $stageTimes = [
            'applied' => $this->calculateAverageStageTime($applications, 'applied'),
            'reviewing' => $this->calculateAverageStageTime($applications, 'reviewing'),
            'interview' => $this->calculateAverageStageTime($applications, 'interview'),
        ];

        // Average AI score
        $avgAIScore = $applications->avg('ai_score') ?? 0;

        // Top companies
        $topCompanies = $applications
            ->groupBy('company_name')
            ->map(fn($group) => [
                'company' => $group->first()->company_name,
                'applications' => $group->count(),
                'success_rate' => ($group->whereIn('status', ['interview', 'offer'])->count() / $group->count()) * 100
            ])
            ->values()
            ->sortByDesc('success_rate')
            ->take(5);

        return response()->json([
            'summary' => [
                'total_applications' => $total,
                'applied' => $applied,
                'reviewing' => $reviewing,
                'interview' => $interview,
                'offers' => $offers,
                'rejected' => $rejected,
            ],
            'funnel' => [
                'application_to_response_rate' => round($applicationToResponseRate, 2),
                'response_to_interview_rate' => round($responseToInterviewRate, 2),
                'interview_to_offer_rate' => round($interviewToOfferRate, 2),
            ],
            'stage_times' => $stageTimes,
            'average_ai_score' => round($avgAIScore, 2),
            'top_companies' => $topCompanies,
        ]);
    }

    public function getApplicationTrends(Request $request)
    {
        $user = $request->user();
        $days = $request->input('days', 30);

        $applications = $user->applications()
            ->where('applied_at', '>=', now()->subDays($days))
            ->get()
            ->groupBy(fn($app) => $app->applied_at->format('Y-m-d'))
            ->map(fn($group) => [
                'date' => $group->first()->applied_at->format('Y-m-d'),
                'count' => $group->count(),
                'statuses' => $group->groupBy('status')->mapWithKeys(fn($items, $status) => [$status => $items->count()])
            ])
            ->values();

        return response()->json([
            'trends' => $applications,
            'period_days' => $days,
        ]);
    }

    public function getSkillAnalysis(Request $request)
    {
        $user = $request->user();
        $userSkills = $user->skills ?? [];

        // Get most demanded skills from applications
        $allSkillsFromApplications = collect();
        foreach ($user->applications as $app) {
            if ($app->job_description) {
                // Simple keyword extraction (would be enhanced with NLP in ML service)
                $skills = $this->extractSkillsFromJobDescription($app->job_description);
                $allSkillsFromApplications = $allSkillsFromApplications->merge($skills);
            }
        }

        $skillFrequency = $allSkillsFromApplications
            ->countBy()
            ->sortDesc()
            ->take(10);

        // Calculate gaps
        $skillGaps = [];
        foreach ($skillFrequency as $skill => $count) {
            if (!in_array($skill, $userSkills)) {
                $skillGaps[] = [
                    'skill' => $skill,
                    'frequency' => $count,
                    'gap' => true
                ];
            }
        }

        return response()->json([
            'user_skills' => $userSkills,
            'most_demanded_skills' => $skillFrequency->toArray(),
            'skill_gaps' => $skillGaps,
        ]);
    }

    private function calculateAverageStageTime($applications, $stage)
    {
        $stageApps = $applications->where('status', $stage);
        if ($stageApps->isEmpty()) {
            return 0;
        }

        $totalDays = $stageApps->map(fn($app) => now()->diffInDays($app->applied_at))->sum();
        return round($totalDays / $stageApps->count(), 2);
    }

    private function extractSkillsFromJobDescription($jobDescription)
    {
        // Common tech skills for demonstration
        $commonSkills = [
            'PHP', 'Laravel', 'JavaScript', 'React', 'Vue', 'Angular',
            'Python', 'Java', 'C#', '.NET', 'Node.js', 'Express',
            'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
            'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
            'Git', 'REST API', 'GraphQL', 'Microservices'
        ];

        $foundSkills = [];
        foreach ($commonSkills as $skill) {
            if (stripos($jobDescription, $skill) !== false) {
                $foundSkills[] = $skill;
            }
        }

        return $foundSkills;
    }
}
