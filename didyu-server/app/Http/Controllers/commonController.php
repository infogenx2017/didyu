<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\role;
use App\User;
use App\designation;
use App\department;
use App\priority;
use App\status;
use App\task;
use App\team;
use App\teamuser;
use App\type;
use App\title;
use App\Category;
use Mail;
use Hash;

class commonController extends Controller
{
    public function roles(){
        return role::get();
    }

    public function users(){
        $users = User::get();
        foreach($users as $user){
            if($user->isActive == 0){
                $user->activeStatus = "No";
                $user->changeStatus = "approve";
                $user->changeStatusValue = 1;
            }
            else {
                $user->activeStatus = "Yes";
                $user->changeStatus = "disapprove";
                $user->changeStatusValue = 0;
            }

            $roles = role::where('id',$user->role_id)->get();
            if(count($roles)>0){
                $user->role = $roles[0]->name;
                if($user->role=='admin'){
                    $user->changerole = 'user';
                }
                else {
                    $user->changerole = 'admin';
                }
            }
        }
        return $users;
    }

    public function usersOnly(){
        $roles = role::where('name','user')->get();
        $users = user::where('role_id',$roles[0]->id)->get();
        return $users;
    }

    public function addrole(Request $request){
        $roles = new role();
        $roles->name = $request->name;
        $roles->save();
        return "Success";
    }

    public function designation(){
        return designation::get();
    }

    public function adddesignation(Request $request){
        $designations = new designation();
        $designations->name = $request->name;
        $designations->save();
        return "Success";
    }

    public function changestatus(Request $request){
        $users = User::where('id', $request->id)->get();
        // return $users[0]->email;
        if($request->changeStatusValue == 1){
            $data = array('name'=>$users[0]->name,'email'=>$users[0]->email);
            Mail::send('activation', $data, function($message) use ($users){
                $message->to($users[0]->email, $users[0]->name)->subject
                    ('Welcome Mail from DidU');
                $message->from('manimac333@gmail.com','DidU');
            });
        }
        User::where('id', $request->id)
          ->update(['isActive' => $request->changeStatusValue]);
          return response()->json("Success");
    }


    public function changerole(Request $request){
        $roles = role::where('name',$request->changeStatusValue)->get();
        $roles = $roles[0];
        User::where('id', $request->id)
          ->update(['role_id' => $roles->id]);
          return response()->json("Success");
    }

    public function userrole(Request $request){
        $users = User::where('id', $request->id)->get();
        foreach($users as $user){
            $roles = role::where('id',$user->role_id)->get();
            if(count($roles)>0){
                $user->role = $roles[0]->name;
            }
        }
          return response()->json($users[0]);
    }


    public function sendEmail(){
        $to = "manimaccse@gmail.com";
        $subject = "My subject";
        $txt = "Hello world!";
        $headers = "From: manimaccse@gmail.com" . "\r\n" .
        "CC: manimaccse@gmail.com";

        mail($to,$subject,$txt,$headers);
        return "Success";
    }

    public function getOptions(){
        $priority = priority::get();
        $status = status::where('name','!=','Overdue')->orderBy('sequence','asc')->get();
        //$roles = role::where('name','user')->get();
        //$users = user::where('role_id',$roles[0]->id)->get();
        $users = user::all();
        $type = type::get();
        return response()->json(array('priority'=>$priority,'status'=>$status,'users'=>$users,'type'=>$type));
    }

    public function createtask(Request $request){
        $users = User::where('id', $request['user_id'])->get();
        $data = array('name'=>$users[0]->name,'email'=>$users[0]->email,'title' => $request['title'],'description' => $request['description'],'due_date' => $request['due_date']);
        Mail::send('notify', $data, function($message) use ($users){
            $message->to($users[0]->email, $users[0]->name)->subject
                ('Notification from DidU');
            $message->from('nireshkumar27@gmail.com','DidU');
        });

        $task = task::create([
            'title' => $request['title'],
            'description' => $request['description'],
            'user_id' => $request['user_id'],
            'created_by' => $request['created_by'],
            'type_id' => $request['type_id'],
            'priority_id' => $request['priority_id'],
            'status_id' => $request['status_id'],
            'overdue' => $request['overdue'],
            'due_date' => $request['due_date'],
            'expected_date' => $request['expected_date'],
            'reminder_date' => $request['reminder_date'],
            'is_recurring' => $request['is_recurring'],
            'recurring_type' => $request['recurring_type'],
            'recurring_when' => $request['recurring_when'],
            'recurring_end_date' => $request['recurring_end_date'],
            'status_notify' => $request['status_notify'],
            'overdue_notify' => $request['overdue_notify'],
            'parent_task' => 0,
        ]);

        if($request['is_recurring'] == 1 || $request['is_recurring'] == '1') {
            if($request['recurring_end_date'] > $request['due_date']) {
                if($request['recurring_type'] == 'Monthly' || $request['recurring_type'] == 'Yearly') {
                    $year = date("Y");
                    $recurringDate = $request['recurring_when'].'-'.$year;
                    $nextDate = date('Y-m-d', strtotime($recurringDate));
                } else {
                    $curDate = strtotime($request['due_date']);
                    $nextDate = date('Y-m-d', strtotime('+1 days', $curDate));
                }
                while($request['recurring_end_date'] >= $nextDate) {
                    switch ($request['recurring_type']) {
                        case "Every Day":
                            task::create([
                                'title' => $request['title'],
                                'description' => $request['description'],
                                'user_id' => $request['user_id'],
                                'created_by' => $request['created_by'],
                                'type_id' => $request['type_id'],
                                'priority_id' => $request['priority_id'],
                                'status_id' => $request['status_id'],
                                'overdue' => $request['overdue'],
                                'due_date' => $nextDate,
                                'status_notify' => $request['status_notify'],
                                'overdue_notify' => $request['overdue_notify'],
                                'parent_task' => $task->id
                            ]);
                            $curDate = strtotime($nextDate);
                            $nextDate = date('Y-m-d', strtotime('+1 days', $curDate));
                            break;
                        case "Every Weekday":
                        case "Every Second Weekday":
                        case "Weekly":
                            $dayNumber = date('w', strtotime($nextDate));
			    $aRechWhen = explode(',', $request['recurring_when']);
                            if(in_array(($dayNumber++), $aRechWhen)) {
                                task::create([
                                    'title' => $request['title'],
                                    'description' => $request['description'],
                                    'user_id' => $request['user_id'],
                                    'created_by' => $request['created_by'],
                                    'type_id' => $request['type_id'],
                                    'priority_id' => $request['priority_id'],
                                    'status_id' => $request['status_id'],
                                    'overdue' => $request['overdue'],
                                    'due_date' => $nextDate,
                                    'status_notify' => $request['status_notify'],
                                    'overdue_notify' => $request['overdue_notify'],
                                    'parent_task' => $task->id
                                ]);
                            }
                            $curDate = strtotime($nextDate);
                            $nextDate = date('Y-m-d', strtotime('+1 days', $curDate));
                            break;
                        case "Monthly":
                        case "Yearly":
                            if($nextDate > $request['due_date']) {
                                task::create([
                                    'title' => $request['title'],
                                    'description' => $request['description'],
                                    'user_id' => $request['user_id'],
                                    'created_by' => $request['created_by'],
                                    'type_id' => $request['type_id'],
                                    'priority_id' => $request['priority_id'],
                                    'status_id' => $request['status_id'],
                                    'overdue' => $request['overdue'],
                                    'due_date' => $nextDate,
                                    'status_notify' => $request['status_notify'],
                                    'overdue_notify' => $request['overdue_notify'],
                                    'parent_task' => $task->id
                                ]);
                            }
                            $nextDate = date('Y-m-d', strtotime('+1 year', strtotime($nextDate)));
                            break;
                    }
                }
            }
        }

        return response()->json("Success");
    }

    public function updatetask(Request $request){
        task::where('id',$request->id)->update([
            /*'title' => $request['title'],
            'description' => $request['description'],
            'user_id' => $request['user_id'],
            //'created_by' => $request['created_by'],
            'type_id' => $request['type_id'],
            'priority_id' => $request['priority_id'],
            'status_id' => $request['status_id'],
            'overdue' => $request['overdue'],
            'due_date' => $request['due_date'],
            'reminder_date' => $request['reminder_date'],
            'status_id' => $request['status_id'],*/
            'title' => $request['title'],
            'description' => $request['description'],
            'user_id' => $request['user_id'],
            //'created_by' => $request['created_by'],
            'type_id' => $request['type_id'],
            'priority_id' => $request['priority_id'],
            'status_id' => $request['status_id'],
            'overdue' => $request['overdue'],
            'due_date' => $request['due_date'],
            'expected_date' => $request['due_date'],
            'reminder_date' => $request['reminder_date'],
            'is_recurring' => $request['is_recurring'],
            'recurring_type' => $request['recurring_type'],
            'recurring_when' => $request['recurring_when'],
            'recurring_end_date' => $request['recurring_end_date'],
            'status_notify' => $request['status_notify'],
            'overdue_notify' => $request['overdue_notify'],
            'parent_task' => 0
        ]);

        if($request['is_recurring'] == 1 || $request['is_recurring'] == '1') {
            task::where('parent_task',$request->id)->delete();
            if($request['recurring_end_date'] > $request['due_date']) {
                if($request['recurring_type'] == 'Monthly' || $request['recurring_type'] == 'Yearly') {
                    $year = date("Y");
                    $recurringDate = $request['recurring_when'].'-'.$year;
                    $nextDate = date('Y-m-d', strtotime($recurringDate));
                } else {
                    $curDate = strtotime($request['due_date']);
                    $nextDate = date('Y-m-d', strtotime('+1 days', $curDate));
                }
                while($request['recurring_end_date'] >= $nextDate) {
                    switch ($request['recurring_type']) {
                        case "Every Day":
                            task::create([
                                'title' => $request['title'],
                                'description' => $request['description'],
                                'user_id' => $request['user_id'],
                                //'created_by' => $request['created_by'],
                                'type_id' => $request['type_id'],
                                'priority_id' => $request['priority_id'],
                                'status_id' => $request['status_id'],
                                'overdue' => $request['overdue'],
                                'due_date' => $nextDate,
                                'expected_date' => $nextDate,
                                'status_notify' => $request['status_notify'],
                                'overdue_notify' => $request['overdue_notify'],
                                'parent_task' => $request->id
                            ]);
                            $curDate = strtotime($nextDate);
                            $nextDate = date('Y-m-d', strtotime('+1 days', $curDate));
                            break;
                        case "Every Weekday":
                        case "Every Second Weekday":
                        case "Weekly":
                            $dayNumber = date('w', strtotime($nextDate));
                            if(($dayNumber++) == $request['recurring_when']) {
                                task::create([
                                    'title' => $request['title'],
                                    'description' => $request['description'],
                                    'user_id' => $request['user_id'],
                                    //'created_by' => $request['created_by'],
                                    'type_id' => $request['type_id'],
                                    'priority_id' => $request['priority_id'],
                                    'status_id' => $request['status_id'],
                                    'overdue' => $request['overdue'],
                                    'due_date' => $nextDate,
                                    'expected_date' => $nextDate,
                                    'status_notify' => $request['status_notify'],
                                    'overdue_notify' => $request['overdue_notify'],
                                    'parent_task' => $request->id
                                ]);
                            }
                            $curDate = strtotime($nextDate);
                            $nextDate = date('Y-m-d', strtotime('+1 days', $curDate));
                            break;
                        case "Monthly":
                        case "Yearly":
                            if($nextDate > $request['due_date']) {
                                task::create([
                                    'title' => $request['title'],
                                    'description' => $request['description'],
                                    'user_id' => $request['user_id'],
                                    //'created_by' => $request['created_by'],
                                    'type_id' => $request['type_id'],
                                    'priority_id' => $request['priority_id'],
                                    'status_id' => $request['status_id'],
                                    'overdue' => $request['overdue'],
                                    'due_date' => $nextDate,
                                    'expected_date' => $nextDate,
                                    'status_notify' => $request['status_notify'],
                                    'overdue_notify' => $request['overdue_notify'],
                                    'parent_task' => $request->id
                                ]);
                            }
                            $nextDate = date('Y-m-d', strtotime('+1 year', strtotime($nextDate)));
                            break;
                    }
                }
            }
        }

        $oTask = task::where('id',$request->id)->first();
        if($oTask->status_notify == true || $oTask->status_notify == '1' || $oTask->status_notify == 1){
            $oSupervisor = User::where('id',$oTask->created_by)->first();
            $oStatus = status::where('id',$request['status_id'])->first();
            $oTitle = title::where('id',$request['title'])->first();

            //send mail to supervisor/admin
            $data = array('name'=>$oSupervisor->name,'email'=>$oSupervisor->email,'title' => $oTitle->name,'description' => $request['description'],'due_date' => $request['due_date'], 'status' => $oStatus->name );
            Mail::send('status', $data, function($message) use ($oSupervisor,$oStatus){
                $message->to($oSupervisor->email, $oSupervisor->name)->subject
                    ("DidYu Notification - Task ".$oStatus->name);
                $message->from('nireshkumar27@gmail.com','DidYu');
            });

            //send mail to task owner
            /*$users = User::where('id', $request['user_id'])->get();
            $data = array('name'=>$users[0]->name,'email'=>$users[0]->email,'title' => $request['title'],'description' => $request['description'],'due_date' => $request['due_date'], 'status' => $oStatus->name );
            Mail::send('status', $data, function($message) use ($users){
                $message->to($users[0]->email, $users[0]->name)->subject
                    ("DidYu: A task's status has been changed");
                $message->from('manimac333@gmail.com','DidU');
            });*/
        }

        return response()->json("Success");
    }

    public function deletetask(Request $request){
        task::where('id',$request->id)->delete();
        return response()->json("Success");
    }

    public function deleteUser(Request $request){
        User::where('id',$request->id)->delete();
        task::where('user_id',$request->id)->delete();
        return response()->json("Success");
    }

    public function gettask(Request $request){
        $user = User::where('id',$request->id)->get();
        $roles = role::where('id',$user[0]->role_id)->get();
        if($roles[0]->name =='user'){
            $tasks = task::where('user_id',$request->id)->orderBy('id','desc')->get();
        }
        else {
            $tasks = task::orderBy('id','desc')->get();
        }        
        foreach($tasks as $key => $task){
            /*$title = title::where('id',$task->title)->get();
            if(count($title)>0){
                $task->titles = $title[0];
            }*/
            $title = title::where('id',$task->title)->get();
            if(count($title)>0){
                $task->titles = $title[0];
                $tasks[$key]->title = $title[0]->name;
            }
            $priority = priority::where('id',$task->priority_id)->get();
            if(!empty($priority[0])){
                $task->priority = $priority[0]->name;
                $task->priorityColor = $priority[0]->color;
            }
            $type = type::where('id',$task->type_id)->get();
            $task->type = $type[0]->name;
            $status = status::where('id',$task->status_id)->get();
            if(!empty($status[0])){
                $task->status = $status[0]->name;
                $task->statusColor = $status[0]->color;    
            } else {
                $task->status = 'In Progress';
                $task->statusColor = '#FF9800';
            }
            
            $assignee = user::where('id',$task->user_id)->get();
            $task->assignee = $assignee[0]->name;           
        }
        return $tasks;
    }

    public function gettaskCount(Request $request){
        $status = status::get();
        /*$user = User::where('id',$request->userId)->get();
        $roles = role::where('id',$user[0]->role_id)->get();*/        
        foreach($status as $sta){
            $oUser = User::find($request->userId);

            if($oUser->role_id == 1) {
                if($request->memberId != '') {
                    $tasks = task::where('user_id',$request->memberId)->where('status_id',$sta->id)->count();
                    $sta->taskCount = $tasks;
                }
                else {
                    $tasks = task::where('status_id',$sta->id)->count();
                    $sta->taskCount = $tasks;
                }
            }
            else {
                $tasks = task::where('user_id',$request->userId)->where('status_id',$sta->id)->count();
                $sta->taskCount = $tasks;
            }
            

            /*if($roles[0]->name =='user'){
                $tasks = task::where('user_id',$request->id)->where('status_id',$sta->id)->count();
                $sta->taskCount = $tasks;
            }
            else{
                $tasks = task::where('status_id',$sta->id)->count();
                $sta->taskCount = $tasks;
            }*/
        }
        return $status;
    }



    public function updateUser(){
        // User::where('email','admin@gmail.com')->update(['role_id'=>1]);
        $user = User::where('email','admin@gmail.com')->update(['password'=>Hash::make('123456')]);
        return response()->json("Success");
    }

    public function notifications(Request $request){
        $tasks = task::limit(5)->get();        
        return $tasks;
    }

    public function addNote(Request $request){
        task::where('id',$request->id)->update([
            'note' => $request['note']
        ]);
        return response()->json("Success");
    }

    public function deleteNote(Request $request){
        task::where('id',$request->id)->update([
            'note' => ''
        ]);
        return response()->json("Success");
    }

    public function addtitle(Request $request){
        return title::create([
            'name' => $request['title'],
            'category_id'=>$request['category_id']
        ]);
    }
    public function titles(){
        $title = title::get();      
        foreach($title as $tit){
            $cat = Category::where('id',$tit->category_id)->get(); 
            if(count($cat)>0){
                $tit->category_name = $cat[0]->name;
            }
            else{
                $tit->category_name = '';
            }            
        }  
        return $title;
    }

    public function deletetitle(Request $request){
        title::where('id',$request->id)->delete();
        return response()->json("Success");
    }

    public function updatetitle(Request $request){
        title::where('id',$request->title_id)->update([
            'name' => $request->title,
            'category_id'=>$request->cat_id
        ]);
        return response()->json("Success");
    }


    public function addcategory(Request $request){
        return Category::create([
            'name' => $request['title']
        ]);
    }
    public function categories(){
        $title = Category::get();        
        return $title;
    }

    public function deletecategory(Request $request){
        Title::where('category_id',$request->id)->delete();
        Category::where('id',$request->id)->delete();
        return response()->json("Success");
    }

    public function updateCategory(Request $request){
        Category::where('id',$request->catid)->update([
            'name' => $request->title
        ]);
        return response()->json("Success");
    }

    public function categoriesTitle(){
        $categories = Category::get();
        foreach($categories as $category){
            $titles = title::where('category_id',$category->id)->get();
            foreach ($titles as $key => $title) {
                $titles[$key]->cssClass = "child_row";
                $titles[$key]->type = "title";
            }
            $category->children = $titles;      
            $category->expanded = true;
            $category->backColor = "#5CB673";
            $category->cssClass = "parent_row";
            $category->type = "category";
        }   
        return $categories;
    }

    public function getevents(Request $request){
        $tasks = task::get();     
        foreach($tasks as $key => $task){
            $title = title::where('id',$task->title)->get();
            $status = status::where('id',$task->status_id)->get();
            if(!empty($status[0])){
                $task->status = $status[0]->name;
                if(count($title)>0){
                    $task->titles = $title[0];
                    $tasks[$key]->title = $title[0]->name;
                    $tasks[$key]->title_id = $title[0]->id;
                }            
            }
        }   
        return $tasks;
    }

    public function getUserTasks(Request $request) {
        
        $oUser = User::find($request->userId);

        if($oUser->role_id == 1) {
            if($request->memberId != '')
                $tasks = task::where('user_id',$request->memberId)->get();
            else
                $tasks = task::get();
        }
        else
            $tasks = task::where('user_id',$request->userId)->get();

        foreach($tasks as $key => $task){
            $title = title::where('id',$task->title)->get();
            $status = status::where('id',$task->status_id)->get();
            if(!empty($status[0])){
                $task->status = $status[0]->name;
                if(count($title)>0){
                    $task->titles = $title[0];
                    $tasks[$key]->title = $title[0]->name;
                    $tasks[$key]->title_id = $title[0]->id;
                }            
            }
        }   
        return $tasks;

    }

    public function filterEvents(Request $request){
        if($request->priority == 0) {
            $tasks = task::get();
        } else {
            $tasks = task::where('priority_id',$request->priority)->get();
        }
        if($tasks) {
            foreach($tasks as $task){
                $title = title::where('name',$task->title)->get();
                $status = status::where('id',$task->status_id)->get();
                if(!empty($status[0])){
                    $task->status = $status[0]->name;
                    if(count($title)>0){
                        $task->titles = $title[0];
                    }            
                }
            }

            return $tasks;
        } else {
            return [];
        }
    }

    public function filterEventsByStatus(Request $request){
        if($request->status == 0) {
            $tasks = task::get();
        } else {
            $tasks = task::where('status_id',$request->status)->get();
        }
        if($tasks) {
            foreach($tasks as $task){
                $title = title::where('id',$task->title)->get();
                $status = status::where('id',$task->status_id)->get();
                if(!empty($status[0])){
                    $task->status = $status[0]->name;
                    if(count($title)>0){
                        $task->titles = $title[0];
                    }            
                }
            }

            return $tasks;
        } else {
            return [];
        }
    }

    public function alertOverdue(Request $request) {
        $aTasks = task::where('due_date','<',\DB::raw('CURDATE()'))->get();
        foreach ($aTasks as $key => $oTask) {
            $start_date = strtotime(date_format(date_create($oTask->due_date),'Y/m/d')); 
            $end_date = strtotime(date('Y/m/d'));
            $date_difference = ($end_date - $start_date)/60/60/24; 
            if($date_difference == $oTask->overdue) {
                //change status to overdue
                task::update('status_id','2')->where('id',$oTask->id);

                if($oTask->overdue_notify == true || $oTask->overdue_notify == '1' || $oTask->overdue_notify == 1){
                    $oSupervisor = User::where('id',$oTask->created_by)->first();
                    $oStatus = status::where('id',$request['status_id'])->first();
                    $oTitle = title::where('id',$request['title'])->first();

                    //send mail to supervisor/admin
                    $data = array('name'=>$oSupervisor->name,'email'=>$oSupervisor->email,'title' => $oTitle->name,'description' => $request['description'],'due_date' => $request['due_date'], 'status' => $oStatus->name );
                    Mail::send('status', $data, function($message) use ($oSupervisor,$oStatus){
                        $message->to($oSupervisor->email, $oSupervisor->name)->subject
                            ("DidYu Notification - Overdue Task");
                        $message->from('manimac333@gmail.com','DidYu');
                    });
                    /*$data = array('name'=>$oSupervisor->name,'email'=>$oSupervisor->email,'title' => $request['title'],'description' => $request['description'],'due_date' => $request['due_date'], 'status' => $oStatus->name);
                    Mail::send('status', $data, function($message) use ($oSupervisor){
                        $message->to($oSupervisor->email, $oSupervisor->name)->subject
                            ("DidYu: A task is overdue");
                        $message->from('manimac333@gmail.com','DidU');
                    });

                    //send mail to task owner
                    $oUser = User::where('id',$oTask->user_id)->first();
                    $data = array('name'=>$oUser->name,'email'=>$oUser->email,'title' => $oTask->title,'description' => $oTask->description,'due_date' => $oTask->due_date, 'status' => $oStatus->name);
                    Mail::send('status', $data, function($message) use ($oUser){
                        $message->to($users[0]->email, $users[0]->name)->subject
                            ("DidYu: A task's status has been changed");
                        $message->from('manimac333@gmail.com','DidU');
                    });*/
                }
            }
            exit;
        }
    }

    public function getCategoryName(Request $request) {
        $aCategory = Category::where('id',$request->cat_id)->first();
        return json_encode($aCategory->name);
    }

    public function getCatTitleName(Request $request) {
        $aTitle = title::where('id',$request->title_id)->first();
        return json_encode($aTitle->name);
    }

    public function getRoles(Request $request) {
        $aRole = role::get();
        return json_encode($aRole);
    }

    public function getDepartments(Request $request) {
        $aRole = department::get();
        return json_encode($aRole);
    }

    public function getDesignations(Request $request) {
        $aRole = designation::get();
        return json_encode($aRole);
    }

    public function addUser(Request $request) {
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'mobile' => $request->mobile,
            'role_id' => $request->role_id,
            'department_id' => $request->department_id,
            'designation_id' => $request->designation_id,
            'isActive' => (int)$request->isActive,
        ]);

        return response()->json("Success");        
    }

    public function getCategories() {
        $aCategories = Category::select('id','name as text')->get();
        $aRes = [];
        foreach ($aCategories as $key => $value) {
            $aRes[$value->id] = $value->name;
        }

        return json_encode($aCategories);
    }

    public function addOrUpdateCategory(Request $request) {
        if($request->catid != null || $request->catid != '') {
            $isExist = category::where('id',$request->catid)->exists();
            if(!$isExist) {
                Category::create(['name' => $request->catid]);
            }

            return $this->getCategories();
        } else {
            return $this->getCategories();
        }
    }

    public function getTitlesOfCategory(Request $request) {
        if($request->catid != null) {
            $aTitles = title::select('id','name as text')->where('category_id',$request->catid)->get();
            $aRes = [];
            foreach ($aTitles as $key => $value) {
                $aRes[$value->id] = $value->name;
            }

            return json_encode($aTitles);
        }
    }

    public function addOrUpdateTitle(Request $request) {
        if($request->catid != null && $request->title != '') {
            $isExist = title::where('id',$request->title)->where('category_id',$request->catid)->exists();
            if(!$isExist) {
                title::create(['name' => $request->title,'category_id' => $request->catid]);
            }

            return $this->getTitlesOfCategory($request);
        }
    }
}

