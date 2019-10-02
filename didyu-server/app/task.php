<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class task extends Model
{
    protected $fillable = [
        'title', 'description', 'user_id','type_id','type_data','priority_id', 'status_id', 'due_date','reminder_date','expected_date'
    ];

    public function typeDay()
    {
        return $this->hasOne('App\Days','id','type_data');
    }
}
