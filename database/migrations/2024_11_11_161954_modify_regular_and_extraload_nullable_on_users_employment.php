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
        Schema::table('users_employments', function (Blueprint $table) {
            $table->tinyInteger('regular_load')->nullable()->change();
            $table->tinyInteger('extra_load')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users_employments', function (Blueprint $table) {
            $table->tinyInteger('regular_load')->nullable(false)->change();
            $table->tinyInteger('extra_load')->nullable(false)->change();
        });
    }
};
