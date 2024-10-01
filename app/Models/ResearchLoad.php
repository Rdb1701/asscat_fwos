<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResearchLoad extends Model
{
    use HasFactory;

    protected $fillable = 
    [
        'load_desc',
        'units',
        'user_id'
    ];
   
}
