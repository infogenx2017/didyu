var appModule = angular.module('taskmgmt',['ui.router']);
appModule.config(function($stateProvider,$urlRouterProvider){    
    $urlRouterProvider.otherwise('/dashboard');
    $stateProvider
    .state('dashboard',
        {
            url : '/dashboard',
            templateUrl : 'views/dashboard/home.html'
        }
    )
    .state('addusers',
        {
            url : '/addusers',
            templateUrl : 'views/users/addUsers.html'
        }
    )
    .state('users',
        {
            url : '/users',
            templateUrl : 'views/users/users.html'
        }
    )
    .state('roles',
        {
            url : '/roles',
            templateUrl : 'views/roles.html'
        }
    )
    .state('designations',
        {
            url : '/designations',
            templateUrl : 'views/designations.html'
        }
    )    
});
