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
            $table->foreignId('academic_id')->constrained('academic_years')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('faculty_loads', function (Blueprint $table) {
            $table->dropForeign(['academic_id']);  // Drop the foreign key constraint
            $table->dropColumn('academic_id'); 
        });
    }
};
