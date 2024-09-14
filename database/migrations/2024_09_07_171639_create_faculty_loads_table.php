<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('faculty_loads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('curriculum_id')->constrained('curricula')->onDelete('cascade');
            $table->string('contact_hours');
            $table->foreignId('administrative_id')->constrained('administrative_loads')->onDelete('cascade');
            $table->foreignId('research_load_id')->constrained('research_loads')->onDelete('cascade');
            $table->string('section');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculty_loads');
    }
};
