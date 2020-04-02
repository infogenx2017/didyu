<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * Indicates whether the XSRF-TOKEN cookie should be set on the response.
     *
     * @var bool
     */
    protected $addHttpCookie = true;

    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    private $openRoutes = ['doSignUp','doLogin','logout','isLogin','changestatus','userrole','changerole','createtask','gettaskCount','gettask','reset','updatepassword','updatetask','deletetask','deleteUser','notifications','addNote','deleteNote','addtitle','deletetitle','updatetitle','addcategory','deletecategory','updatecategory','filterEvents'];
    protected $except = [
        '/doSignUp',
        '/doLogin',
        '/logout',
        '/isLogin',
        '/changestatus',
        '/userrole',
        '/changerole',
        '/createtask',
        '/gettaskCount',
        '/gettask',
        '/reset',
        '/updatepassword',
        '/updatetask',
        '/deletetask',
        '/deleteUser',
        '/notifications',
        '/addNote',
        '/deleteNote',
        '/addtitle',
        '/deletetitle',
        '/updatetitle',
        '/addcategory',
        '/deletecategory',
        '/updatecategory',
	'/filterEvents'
    ];
}
