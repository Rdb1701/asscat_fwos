<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Specialization extends Model
{
    use HasFactory;

    protected $fillable = 
    [
        'name',
        'course_id'
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_specializations');
    }

    public function curricula(): HasMany
    {
        return $this->hasMany(Curriculum::class);
    }


}
