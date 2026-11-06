<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PublicationSchedule extends Model
{
    protected $fillable = ['user_id', 'weekday', 'category_slugs'];
    protected function casts(): array { return ['category_slugs' => 'array', 'weekday' => 'integer']; }
}
