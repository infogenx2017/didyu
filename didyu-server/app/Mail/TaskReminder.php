<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class TaskReminder extends Mailable
{
    use Queueable, SerializesModels;
    protected $task;
    protected $user;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user, $task)
    {
        $this->user = $user;
        $this->task = $task;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.taskreminder')
                    ->subject('Task Reminder')
                    ->from('admin@didyu.com', 'Task Reminder')
                    ->with([
                        'user'=> $this->user,
                        'task' => $this->task,
                    ]);
    }
}
