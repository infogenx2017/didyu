<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\task;
use Carbon\Carbon;
use App\Jobs\SendTaskMailJob;
use App\User;
use App\Mail\DueTasks;

class NotifyDueTask extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notify:duetask';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will send email to users whose task are due';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        //One hour is added to compensate for PHP being one hour faster 
        // $now = Carbon::now()->addHour()->toDateTimeString();
        $today = Carbon::today()->toDateString();
        
        //Get all DUE Today Tasks and set status of task to due=3
        $dueTasks = task::whereDate('due_date', $today)->where('status_id','!=','4')->get();
        if(count($dueTasks) > 0){
            $dueTasks->each(function($task) {
                //Update status to due
                $task->status_id = '3';
                $task->save();   
            });
        }
        
        //Get all OVERDUE Tasks and send email and change status to overdue=2
        $overDueTasks = task::whereDate('due_date','<', $today)->where('status_id','!=','4')->get();
        if(count($overDueTasks) > 0){
            $overDueTasks->each(function($task) {
                $user = User::find($task->user_id);
                dispatch(new SendTaskMailJob(
                    $user->email, 
                    new DueTasks($user, $task))
                );
                // update status to overdue
                $task->status_id = '2';
                $task->save();   
            });
        }
    }
}
