<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('success_predictions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->onDelete('cascade');
            $table->decimal('resume_match_score', 5, 2)->nullable();
            $table->json('company_response_history')->nullable();
            $table->decimal('application_timing_score', 5, 2)->nullable();
            $table->decimal('network_connection_score', 5, 2)->nullable();
            $table->decimal('market_demand_score', 5, 2)->nullable();
            $table->decimal('success_probability', 5, 2);
            $table->decimal('confidence_score', 5, 2);
            $table->string('model_version')->default('v1');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('success_predictions');
    }
};
