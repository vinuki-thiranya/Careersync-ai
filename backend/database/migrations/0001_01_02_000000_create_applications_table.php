<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('company_name');
            $table->string('position_title');
            $table->enum('status', ['applied', 'reviewing', 'interview', 'rejected', 'offer'])->default('applied');
            $table->timestamp('applied_at');
            $table->decimal('ai_score', 5, 2)->nullable();
            $table->longText('job_description')->nullable();
            $table->string('salary_range')->nullable();
            $table->string('job_url')->nullable();
            $table->json('stage_history')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
