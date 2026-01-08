<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_name',
        'position_title',
        'status',
        'applied_at',
        'ai_score',
        'job_description',
        'salary_range',
        'job_url',
        'stage_history',
        'notes',
    ];

    protected $casts = [
        'applied_at' => 'datetime',
        'stage_history' => 'json',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function stageUpdates(): HasMany
    {
        return $this->hasMany(ApplicationStageUpdate::class);
    }

    public function successPrediction(): HasMany
    {
        return $this->hasMany(SuccessPrediction::class);
    }
}
