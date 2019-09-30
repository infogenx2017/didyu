<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class title extends Model
{
    protected $fillable = [
        'name','category_id'
    ];
}
