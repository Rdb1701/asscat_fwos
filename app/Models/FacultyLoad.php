<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function curriculum(): BelongsTo
    {
        return $this->belongsTo(Curriculum::class);
    }

    public function administrativeLoad(): BelongsTo
    {
        return $this->belongsTo(AdministrativeLoad::class, 'administrative_id');
    }

    public function researchLoad(): BelongsTo
    {
        return $this->belongsTo(ResearchLoad::class, 'research_load_id');
    }
}
