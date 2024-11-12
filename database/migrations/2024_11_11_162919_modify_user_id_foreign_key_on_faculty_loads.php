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
            // Drop the existing foreign key constraint
            $table->dropForeign(['user_id']);
            
            // Re-add the foreign key with ON DELETE CASCADE
            $table->foreign('user_id')
                  ->references('id')->on('users')
                  ->onDelete('cascade'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('faculty_loads', function (Blueprint $table) {
            // Drop the foreign key and remove cascade behavior
            $table->dropForeign(['user_id']);
            
            // Revert to the original foreign key without cascade
            $table->foreign('user_id')
                  ->references('id')->on('users');
        });
    }
};
