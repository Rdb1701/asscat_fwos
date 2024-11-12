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
            Schema::table('curricula', function (Blueprint $table) {
                // Add new 'efectivity_year' column
                $table->string('efectivity_year')->nullable();
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('curricula', function (Blueprint $table) {
            Schema::table('curricula', function (Blueprint $table) {
                // Drop the 'efectivity_year' column in case of rollback
                $table->dropColumn('efectivity_year');
            });
        });
    }
};
