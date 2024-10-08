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
        Schema::table('faculty_loads', function (Blueprint $table) {
            $table->foreignId('administrative_id')->nullable()->change();
            $table->foreignId('research_load_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('faculty_loads', function (Blueprint $table) {
            $table->foreignId('administrative_id')->nullable(false)->change();
            $table->foreignId('research_load_id')->nullable(false)->change();
        });
    }
};
