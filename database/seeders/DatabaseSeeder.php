<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name'     => 'Ronald Besinga',
            'email'    => 'registrar@gmail.com',
            'password' => bcrypt('11223344'),
            'role'     => 'Registrar'
        ]);

        User::factory()->create([
            'name'     => 'Dean',
            'email'    => 'dean@gmail.com',
            'password' => bcrypt('11223344'),
            'role'     => 'Dean'
        ]);

        User::factory()->create([
            'name'     => 'Chairperson',
            'email'    => 'chairperson@gmail.com',
            'password' => bcrypt('11223344'),
            'role'     => 'Chairperson'
        ]);

        User::factory()->create([
            'name'     => 'Faculty',
            'email'    => 'faculty@gmail.com',
            'password' => bcrypt('11223344'),
            'role'     => 'Faculty'
        ]);
    }
}
