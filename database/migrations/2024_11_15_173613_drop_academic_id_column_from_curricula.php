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
        Schema::table('curricula', function (Blueprint $table) {
             // Drop the foreign key constraint (if exists)
             $table->dropForeign(['academic_id']);

             // Drop the 'academic_id' column
             $table->dropColumn('academic_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('curricula', function (Blueprint $table) {
            $table->foreignId('academic_id')->constrained('academic_years')->onDelete('cascade');
        });
    }
};
