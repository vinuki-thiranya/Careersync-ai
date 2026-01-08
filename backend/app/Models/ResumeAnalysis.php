<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResumeAnalysis extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'resume_text',
        'ats_score',
        'keyword_gaps',
        'skills_match_percentage',
        'formatting_issues',
        'recommendations',
        'version_number',
    ];

    protected $casts = [
        'keyword_gaps' => 'json',
        'formatting_issues' => 'json',
        'recommendations' => 'json',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
