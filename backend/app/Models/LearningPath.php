<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LearningPath extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'skill_name',
        'recommended_courses',
        'progress_percentage',
        'estimated_hours',
        'status',
    ];

    protected $casts = [
        'recommended_courses' => 'json',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
