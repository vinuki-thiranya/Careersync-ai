<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learning_paths', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('skill_name');
            $table->json('recommended_courses')->nullable();
            $table->integer('progress_percentage')->default(0);
            $table->integer('estimated_hours')->nullable();
            $table->enum('status', ['not_started', 'in_progress', 'completed'])->default('not_started');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_paths');
    }
};
