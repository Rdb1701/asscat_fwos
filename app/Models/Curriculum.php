<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curriculum extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_code',
        'descriptive_title',
        'units',
        'lec',
        'lab',
        'cmo',
        'hei',
        'pre_requisite',
        'academic_id',
        'course_id',
        'year_level'
    ];
}
