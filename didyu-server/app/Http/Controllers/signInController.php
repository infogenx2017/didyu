<?php

namespace App\Http\Controllers;
use View;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use File;
use Validator;
use Illuminate\Support\Facades\Input;
use Auth;
use App\User;
use Hash;
use Session;
use App\role;
use Mail;

class signInController extends Controller
{
    public function showLogin(){
        dd(Auth::check());
        return redirect('/login');
    }

    public function doSignUp(Request $request){
        Session::put('username', $request['name']);
        $role = role::where('name','user')->get();
        if(count($role)>0){
            $roleid = $role[0]->id;
        }
        else{
            $roleid = 2;
        }
        $data = array('name'=>$request['name'],'email'=>$request['email']);
        Mail::send('mail', $data, function($message) use ($request){
            $message->to($request['email'], $request['name'])->subject
                ('Welcome Mail from DidU');
            $message->from('manimac333@gmail.com','DidU');
        });
        return User::create([
            'name' => $request['name'],
            'email' => $request['email'],
            'mobile' => $request['mobile'],
            'role_id' => $roleid,
            'password' => Hash::make($request['password']),
        ]);
    }

    public function doLogin(Request $request)
    {
        $rules = array(
            'email'    => 'required|email',
            'password' => 'required|alphaNum|min:3'
        );

        $userdata = array(
            'email'     => $request->email,
            'password'  => $request->password
        );
        $request->session()->put('current_user',Auth::user());
        if (Auth::attempt($userdata)) {
            $user = User::where('email',$request->email)->get();            
            $user = $user[0];
            Session::put('username', $user->name);
            return response()->json(array('message'=>"Success",'user'=>$user));
        } else {        
            return response()->json(array(
                'code'      =>  404,
                'message'   =>  "Login Failed"
            ), 404);   
        }
    }
    public function logout(){
        Auth::logout(); 
        Session::forget('username');
        return response()->json("Success");
    }

    public function updatePassword(Request $request){
        $user = User::findOrFail($request->id);
        $user->password = Hash::make($request->password);
        $user->update();
        $users = User::where('id', $request->id)->get();
        $data = array('name'=>$users[0]->name,'email'=>$users[0]->email);
        Mail::send('passwordreset', $data, function($message) use ($users){
            $message->to($users[0]->email, $users[0]->name)->subject
                ('Password changed from DidU');
            $message->from('manimac333@gmail.com','DidU');
        });
        return response()->json("Success");
    }

    public function isLogin(){
        dd(Session::get('username'));
        return response()->json(Session::get('username'));
        if(Auth::check()){
            return response()->json("logged");
        }
        else{
            return response()->json("logged_out");
        }
    }

    public function reset(Request $request){
        $users = User::where('email', $request->email)->get();
        $str_result = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; 
        $temporary =  substr(str_shuffle($str_result),0, 8);

        if(count($users)==1){
            $user = User::findOrFail($users[0]->id);
            $user->password = Hash::make($temporary);
            $user->update();
            $data = array('name'=>$users[0]->name,'email'=>$users[0]->email,'password'=>$temporary);
            Mail::send('reset', $data, function($message) use ($users){
                $message->to($users[0]->email, $users[0]->name)->subject
                    ('Reset password from DidU');
                $message->from('manimac333@gmail.com','DidU');
            });
            return response()->json("Success");
        }
        else{
            return response()->json(array(
                'code'      =>  404,
                'message'   =>  "Reset Failed"
            ), 404);
        }
    }
}
