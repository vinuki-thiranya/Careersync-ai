<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resume_analyses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->longText('resume_text');
            $table->integer('ats_score')->default(0);
            $table->json('keyword_gaps')->nullable();
            $table->integer('skills_match_percentage')->default(0);
            $table->json('formatting_issues')->nullable();
            $table->json('recommendations')->nullable();
            $table->integer('version_number')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resume_analyses');
    }
};
