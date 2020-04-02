<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class task extends Model
{
    protected $fillable = [
        'title', 'description', 'user_id','type_id','type_data','priority_id', 'status_id', 'due_date','reminder_date','expected_date','overdue','is_recurring','recurring_type','recurring_when','recurring_end_date','status_notify','overdue_notify','parent_task', 'created_by'
    ];

    public function typeDay()
    {
        return $this->hasOne('App\Days','id','type_data');
    }
}
