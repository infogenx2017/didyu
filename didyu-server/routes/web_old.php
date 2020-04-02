<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Auth::routes();

Route::get('/', function () {
    return view('welcome');
});

Route::post('/doSignUp', 'signInController@doSignUp');
Route::get('/login', 'signInController@showLogin');
Route::post('/doLogin', 'signInController@doLogin');
Route::post('/logout', 'signInController@logout');
Route::post('/isLogin', 'signInController@isLogin');
Route::post('/reset','signInController@reset');
Route::post('/updatepassword', 'signInController@updatePassword');
Route::post('/deleteUser', 'commonController@deleteUser');

Route::get('/users', 'commonController@users');
Route::get('/usersonly', 'commonController@usersonly');

Route::post('/userrole', 'commonController@userrole');
Route::get('/roles', 'commonController@roles');
Route::post('/addrole', 'commonController@addrole');
Route::get('/designation', 'commonController@designation');
Route::post('/adddesignation', 'commonController@adddesignation');
Route::post('/changestatus', 'commonController@changestatus');
Route::post('/changerole', 'commonController@changerole');
Route::get('getOptions','commonController@getOptions');
Route::post('/addNote', 'commonController@addNote');
Route::post('/deleteNote', 'commonController@deleteNote');


Route::post('/createtask', 'commonController@createtask');
Route::post('/gettask', 'commonController@gettask');
Route::post('/gettaskCount', 'commonController@gettaskCount');
Route::post('/updatetask', 'commonController@updatetask');
Route::post('/deletetask', 'commonController@deletetask');

Route::get('/updateUser', 'commonController@updateUser');

Route::post('notifications','commonController@notifications');
Route::post('addtitle','commonController@addtitle');
Route::get('/titles', 'commonController@titles');
Route::post('/deletetitle','commonController@deletetitle');
Route::post('/updatetitle','commonController@updatetitle');
Route::post('addcategory','commonController@addcategory');
Route::get('/categories', 'commonController@categories');
Route::post('/deletecategory','commonController@deletecategory');
Route::post('/updatecategory','commonController@updatecategory');
Route::get('/categoriesTitle', 'commonController@categoriesTitle');
Route::get('/getevents', 'commonController@getevents');
Route::post('/filterEvents', 'commonController@filterEvents');
Route::get('sendbasicemail2','commonController@sendEmail');

Route::get('testEmail', function ()
{

    $data = [
        'key'     => 'value'
    ];

    Mail::send('mail', $data, function ($message) {
        $message->from('manimac333@gmail.com', 'My name');
        $message->subject('subject');
        $message->to('manimaccse@gmail.com');
    });

    dd(Mail::failures());
});

Route::get('sendbasicemail','MailController@basic_email');
Route::get('sendhtmlemail','MailController@html_email');
Route::get('sendattachmentemail','MailController@attachment_email');
