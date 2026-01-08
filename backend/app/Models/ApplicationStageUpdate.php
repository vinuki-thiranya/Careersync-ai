<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicationStageUpdate extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_id',
        'stage',
        'updated_at_timestamp',
        'notes',
    ];

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }
}
