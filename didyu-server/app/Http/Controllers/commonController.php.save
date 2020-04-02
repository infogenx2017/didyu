<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\role;
use App\User;
use App\designation;
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
        $status = status::orderBy('sequence','asc')->get();
        //$roles = role::where('name','user')->get();
        //$users = user::where('role_id',$roles[0]->id)->get();
        $users = user::all();
        $type = type::where('status','1')->get();
        return response()->json(array('priority'=>$priority,'status'=>$status,'users'=>$users,'type'=>$type));
    }

    public function createtask(Request $request){
        $users = User::where('id', $request['user_id'])->get();
        if($request['notify'] == true){
            $data = array('name'=>$users[0]->name,'email'=>$users[0]->email,'title' => $request['title'],'description' => $request['description'],'due_date' => $request['due_date']);
            Mail::send('notify', $data, function($message) use ($users){
                $message->to($users[0]->email, $users[0]->name)->subject
                    ('Notification from DidU');
                $message->from('manimac333@gmail.com','DidU');
            });
        }
        return task::create([
            'title' => $request['title'],
            'description' => $request['description'],
            'user_id' => $request['user_id'],
            'type_id' => $request['type_id'],
            'type_data' => $request['recurring_data']['recurring_day'],
            'priority_id' => $request['priority_id'],
            'status_id' => $request['status_id'],
	    'overdue' => $request['overdue'],
            'due_date' => $request['due_date'],
            'reminder_date' => $request['reminder_date']
        ]);
    }

    public function updatetask(Request $request){
        task::where('id',$request->id)->update([
            'title' => $request['title'],
            'description' => $request['description'],
            'user_id' => $request['user_id'],
            'type_id' => $request['type_id'],
            'priority_id' => $request['priority_id'],
            'status_id' => $request['status_id'],
	    'overdue' => $request['overdue'],
            'due_date' => $request['due_date'],
            'reminder_date' => $request['reminder_date']
        ]);
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
        foreach($tasks as $task){
            $title = title::where('name',$task->title)->get();
            if(count($title)>0){
                $task->titles = $title[0];
            }
            $title = title::where('name',$task->title)->get();
            if(count($title)>0){
                $task->titles = $title[0];
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
        $user = User::where('id',$request->id)->get();
        $roles = role::where('id',$user[0]->role_id)->get();        
        foreach($status as $sta){
            if($roles[0]->name =='user'){
                $tasks = task::where('user_id',$request->id)->where('status_id',$sta->id)->count();
                $sta->taskCount = $tasks;
            }
            else{
                $tasks = task::where('status_id',$sta->id)->count();
                $sta->taskCount = $tasks;
            }
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
        title::where('id',$request->id)->update([
            'name' => $request->title,
            'category_id'=>$request->category_id
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
        Category::where('id',$request->id)->delete();
        return response()->json("Success");
    }

    public function updatecategory(Request $request){
        Category::where('id',$request->id)->update([
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
            $category->cssClass = 'parent_row';
	    $category->type = "category";
        }   
        return $categories;
    }

    public function getevents(){
        $tasks = task::get();     
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
    }

    public function filterEvents(Request $request){
        $tasks = task::where('priority_id',$request->priority)->get();
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

    public function alertOverdue(Request $request) {
        $aTasks = task::where('due_date','<',\DB::raw('CURDATE()'))->get();
        foreach ($aTasks as $key => $oTask) {
            $start_date = strtotime(date_format(date_create($oTask->due_date),'Y/m/d')); 
            $end_date = strtotime(date('Y/m/d'));
            $date_difference = ($end_date - $start_date)/60/60/24; 
            if($date_difference == $oTask->overdue) {
                $oUser = User::where('id',$oTask->user_id)->first();
                $data = array('name'=>$oUser->name,'email'=>$oUser->email,'title' => $oTask->title,'description' => $oTask->description,'due_date' => $oTask->due_date);
                Mail::send('overdue', $data, function($message) use ($oUser){
                    $message->to($oUser->email, $oUser->name)->subject
                        ('Your task is overdue');
                    $message->from('manimac333@gmail.com','DidU');
                });
            }
            exit;
        }
    }
}
