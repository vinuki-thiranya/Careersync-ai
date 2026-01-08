<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SuccessPrediction extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_id',
        'resume_match_score',
        'company_response_history',
        'application_timing_score',
        'network_connection_score',
        'market_demand_score',
        'success_probability',
        'confidence_score',
        'model_version',
    ];

    protected $casts = [
        'company_response_history' => 'json',
    ];

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }
}
