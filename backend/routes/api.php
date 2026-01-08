<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\ResumeController;
use App\Http\Controllers\Api\CoverLetterController;
use App\Http\Controllers\Api\AnalyticsController;

// Auth routes (public)
Route::prefix('v1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    
    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/profile', [AuthController::class, 'profile']);
        Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
        
        // Applications
        Route::get('/applications/discover', [ApplicationController::class, 'discover']);
        Route::apiResource('applications', ApplicationController::class);
        
        // Resume Analysis
        Route::post('/resume/analyze', [ResumeController::class, 'analyze']);
        Route::get('/resume/analyses', [ResumeController::class, 'listAnalyses']);
        Route::get('/resume/analyses/{analysis}', [ResumeController::class, 'getAnalysis']);
        
        // Cover Letters
        Route::post('/cover-letters/generate', [CoverLetterController::class, 'generate']);
        Route::get('/cover-letters', [CoverLetterController::class, 'listLetters']);
        Route::get('/cover-letters/{coverLetter}', [CoverLetterController::class, 'getLetter']);
        
        // Analytics
        Route::get('/analytics/dashboard', [AnalyticsController::class, 'getDashboard']);
        Route::get('/analytics/trends', [AnalyticsController::class, 'getApplicationTrends']);
        Route::get('/analytics/skills', [AnalyticsController::class, 'getSkillAnalysis']);
    });
});

Route::get('/', function () {
    return response()->json([
        'message' => 'CareerSync AI API',
        'version' => '1.0.0',
        'status' => 'running'
    ]);
});
