<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FacultyLoad extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'curriculum_id',
        'contact_hours',
        'section',
        'administrative_id',
        'research_load_id'
        
    ];
}
