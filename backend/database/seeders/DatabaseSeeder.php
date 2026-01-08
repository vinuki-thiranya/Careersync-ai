<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Application;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create test user
        $user = User::create([
            'name' => 'John Doe',
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'current_role' => 'Full Stack Developer',
            'target_role' => 'Senior Full Stack Developer',
            'years_of_experience' => 5,
            'skills' => [
                'PHP', 'Laravel', 'React', 'JavaScript', 'PostgreSQL',
                'Docker', 'AWS', 'REST API', 'Git', 'Vue.js'
            ],
            'career_preferences' => [
                'locations' => ['Remote', 'San Francisco', 'New York'],
                'industries' => ['Technology', 'SaaS', 'Fintech'],
                'min_salary' => 120000
            ]
        ]);

        // Create sample applications
        $applications = [
            [
                'company_name' => 'Google',
                'position_title' => 'Senior Software Engineer',
                'status' => 'interview',
                'applied_at' => now()->subDays(15),
                'job_description' => 'We are looking for a Senior Software Engineer with expertise in backend systems, microservices, and cloud infrastructure. Strong experience with Go, Python, or Java required.',
                'salary_range' => '$200,000 - $280,000',
                'job_url' => 'https://careers.google.com',
                'ai_score' => 87.5,
            ],
            [
                'company_name' => 'Microsoft',
                'position_title' => 'Software Engineer - Full Stack',
                'status' => 'reviewing',
                'applied_at' => now()->subDays(10),
                'job_description' => 'Looking for a Full Stack Engineer to join our Azure team. Experience with React, Node.js, and cloud platforms required.',
                'salary_range' => '$180,000 - $240,000',
                'job_url' => 'https://careers.microsoft.com',
                'ai_score' => 78.2,
            ],
            [
                'company_name' => 'Amazon',
                'position_title' => 'Backend Engineer',
                'status' => 'applied',
                'applied_at' => now()->subDays(5),
                'job_description' => 'Amazon seeks a Backend Engineer with expertise in distributed systems, databases, and scalable architecture. Java or C++ experience preferred.',
                'salary_range' => '$170,000 - $230,000',
                'job_url' => 'https://amazon.jobs',
                'ai_score' => 72.1,
            ],
            [
                'company_name' => 'Meta',
                'position_title' => 'React Developer',
                'status' => 'interview',
                'applied_at' => now()->subDays(20),
                'job_description' => 'Join Meta to build world-class products. We need experienced React developers with strong JavaScript knowledge and experience with GraphQL.',
                'salary_range' => '$190,000 - $260,000',
                'job_url' => 'https://meta.careers',
                'ai_score' => 81.3,
            ],
            [
                'company_name' => 'Apple',
                'position_title' => 'iOS Engineer',
                'status' => 'rejected',
                'applied_at' => now()->subDays(25),
                'job_description' => 'Apple is looking for iOS engineers with expertise in Swift and UIKit. Experience with CI/CD and testing frameworks essential.',
                'salary_range' => '$160,000 - $220,000',
                'job_url' => 'https://apple.com/jobs',
                'ai_score' => 55.4,
            ],
            [
                'company_name' => 'Tesla',
                'position_title' => 'Full Stack Developer',
                'status' => 'applied',
                'applied_at' => now()->subDays(3),
                'job_description' => 'Tesla seeks Full Stack Engineers to build internal tools and customer-facing applications. Python/JavaScript experience required.',
                'salary_range' => '$150,000 - $210,000',
                'job_url' => 'https://tesla.com/careers',
                'ai_score' => 74.6,
            ],
        ];

        foreach ($applications as $app) {
            Application::create(array_merge($app, ['user_id' => $user->id]));
        }

        // Create resume analyses
        $user->resumeAnalyses()->create([
            'resume_text' => 'John Doe - Full Stack Developer with 5 years of experience...',
            'ats_score' => 82,
            'keyword_gaps' => ['Kubernetes', 'Terraform', 'GraphQL'],
            'skills_match_percentage' => 85,
            'formatting_issues' => ['Consider adding more metrics to achievements'],
            'recommendations' => [
                'Add Kubernetes and Terraform experience sections',
                'Include quantifiable metrics in project descriptions',
                'Improve ATS compatibility by adding more keywords'
            ],
            'version_number' => 1,
        ]);

        // Create cover letters
        $user->coverLetters()->create([
            'company_name' => 'Google',
            'position_title' => 'Senior Software Engineer',
            'content' => 'Dear Google Hiring Team,

I am excited to apply for the Senior Software Engineer position at Google. With 5 years of experience building scalable backend systems and microservices, I am confident in my ability to contribute to your team.

Throughout my career, I have developed expertise in distributed systems, cloud infrastructure, and API design. My background in Go and Python, combined with my experience on AWS and Kubernetes, directly aligns with the requirements of this role.

I am particularly drawn to Google\'s commitment to innovation and excellence. I would welcome the opportunity to discuss how my experience can contribute to your team\'s continued success.

Best regards,
John Doe',
            'tone' => 'professional',
            'generated_at' => now(),
        ]);
    }
}
