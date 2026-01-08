<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AIInsight extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'insight_type',
        'title',
        'description',
        'data',
        'confidence_score',
        'actionable_items',
    ];

    protected $casts = [
        'data' => 'json',
        'actionable_items' => 'json',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
