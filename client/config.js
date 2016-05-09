/**
 * Created by yangyang on 3/2/16.
 */
(function () {
    angular
        .module("LoginApp")
        .config(configuration)
        .run(restrict);

    function configuration($routeProvider, $httpProvider) {

        $routeProvider
            .when("/", {
                templateUrl: "views/home/home.view.html",
            })
            .when("/login", {
                templateUrl: "views/login/login.view.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/dashboard", {
                templateUrl: "views/dashboard/dashboard.view.html",
                controller: "DashboardController",
                controllerAs: "model"
            })
            .when("/lesson", {
                templateUrl: "views/lesson/lesson.view.html",
                controller: "LessonController",
                controllerAs: "model"
            })
            .when("/lesson/:study/:lesson/:page", {
                templateUrl: "views/lesson/lesson.view.html",
                controller: "LessonController",
                controllerAs: "model"
            })
            .when("/api_return/:tokenstring", {
                templateUrl: "views/redirect/redirect.view.html",
                controller: "RedirectController",
                controllerAs: "model"
            })
            .otherwise({
                redirectTo: "/"
            });

        $httpProvider.interceptors.push(authInterceptor);

        function authInterceptor( Auth, $window) {
            return {
                // automatically attach Authorization header
                request: function(config) {
                    var token = Auth.getToken();
                    if(token) {
                        config.headers.Authorization =  token;
                    }
                    return config;
                },

                // If a token was sent back, save it
                response: function(res) {
                    if(res.data.token) {
                        Auth.saveToken(res.data.token);
                    }

                    return res;
                },

                responseError: function(res){
                    if(res.status === 401) {
                        $window.location = "#/login";
                    }
                }
            }
        }

    }

    function restrict ($rootScope, $location, Auth) {
        $rootScope.$on( "$routeChangeStart", function(event, next) {
            if (!Auth.isAuthed()) {
                if ( next.templateUrl === "views/dashboard/dashboard.view.html") {
                    $location.path("/login");
                }
            }else {
                if ( next.templateUrl === "views/login/login.view.html") {
                    $location.path("/dashboard");
                }
            }
        });
    }

})();
