<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseOffering extends Model
{
    use HasFactory;

    protected $fillable = [
        'year_level',
        'academic_id',
        'course_id',
        'section_id'
    ];


    
}
