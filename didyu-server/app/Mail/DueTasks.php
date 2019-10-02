<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Carbon\Carbon;

class DueTasks extends Mailable
{
    use Queueable, SerializesModels;
    protected $due_task;
    protected $user;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user, $due_task)
    {
        $this->user = $user;
        $this->due_task = $due_task;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $dueDate = Carbon::parse($this->due_task->due_date);
        $noOfDueDays = $dueDate->diffForHumans();
        return $this->markdown('emails.duetasks')
                    ->subject('Task due')
                    ->from('admin@didyu.com', 'Due Task')
                    ->with([
                        'user'=> $this->user,
                        'due_task' => $this->due_task,
                        'no_of_due_days' => $noOfDueDays,
                    ]);
    }
}
