<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentNumber extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_number',
        'effective_date',
        'revision_number',
        'for'
    ];
}
