<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'current_role',
        'target_role',
        'years_of_experience',
        'skills',
        'career_preferences',
        'encrypted_resume',
        'profile_picture',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'skills' => 'json',
        'career_preferences' => 'json',
    ];

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function aiInsights(): HasMany
    {
        return $this->hasMany(AIInsight::class);
    }

    public function resumeAnalyses(): HasMany
    {
        return $this->hasMany(ResumeAnalysis::class);
    }

    public function learningPaths(): HasMany
    {
        return $this->hasMany(LearningPath::class);
    }

    public function coverLetters(): HasMany
    {
        return $this->hasMany(CoverLetter::class);
    }
}
