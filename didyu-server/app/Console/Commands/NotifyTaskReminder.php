<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\task;
use Carbon\Carbon;
use App\Jobs\SendTaskMailJob;
use App\User;
use App\Mail\TaskReminder;

class NotifyTaskReminder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notify:taskreminder';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will send email to users to remind their tasks';

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
     * type_id : 1=Every Day, 2=Every Weekday, 3=Every Second Weekday, 4=Weekly, 5=Monthly, 6=Annually
     * type_data : 
     *      Week = 1 to 7, 
     *      Month = 1 to 28/30/31
     * @return mixed
     */
    public function handle()
    {
        $today = Carbon::today();
        $todayDate = $today->toDateString();
        $todayDayNumber = $today->dayOfWeekIso; //get day number 
        $monthDayNumber = $today->day; //get month number
        $yearDate = $today->day.'-'.$today->month; //get 02-04 date format
        
        $tasks = new task;
        $tasks = $tasks->where('due_date','>',$todayDate) //send reminder until task is due
                        ->where('status_id','!=','4') //don't send email if task is completed
                        ->where(function ($query) use ($todayDayNumber) {
                            $query->where('type_id', '2')
                                ->where('type_data', $todayDayNumber);
                        })
                        ->orWhere(function ($query) use ($monthDayNumber) {
                            $query->where('type_id', '5')
                                ->where('type_data', $monthDayNumber);
                        })
                        ->orWhere(function ($query) use ($yearDate) {
                            $query->where('type_id', '6')
                                ->where('type_data', $yearDate);
                        })
                        ->get();

        if($tasks !== null){
            $tasks->each(function($task) {
                $user = User::find($task->user_id);
                dispatch(new SendTaskMailJob(
                    $user->email, 
                    new TaskReminder($user, $task))
                );  
            });
        }
    }
}
