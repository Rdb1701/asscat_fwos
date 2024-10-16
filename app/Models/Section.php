<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Section extends Model
{
    use HasFactory;

    protected $fillable = [
        'section_name',
        'year_level',
        'course_id'
    ];


    public function courseOfferings(): HasMany
    {
        return $this->hasMany(CourseOffering::class);
    }
}
