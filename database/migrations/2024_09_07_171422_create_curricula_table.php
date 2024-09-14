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
        Schema::create('curricula', function (Blueprint $table) {
            $table->id();
            $table->string('course_code');
            $table->string('descriptive_title');
            $table->tinyInteger('units')->nullable();;
            $table->tinyInteger('lec')->nullable();
            $table->tinyInteger('lab')->nullable();
            $table->tinyInteger('cmo')->nullable();
            $table->tinyInteger('hei')->nullable();
            $table->string('pre_requisite')->nullable()->default('None');
            $table->foreignId('academic_id')->constrained('academic_years')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('year_level');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('curricula');
    }
};
