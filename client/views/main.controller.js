/**
 * Created by yangyang on 3/31/16.
 */
(function () {
    angular
        .module("LoginApp")
        .controller("MainController", MainController);

    function MainController($scope, $localStorage, User, Auth, $rootScope,$sce) {
        var self = this;
        self.isAuthed = function () {
            return Auth.isAuthed();
        }

        function successAuth($scope, token) {
            window.location = "#/dashboard";
        }

        self.signin = function (formData) {
            User.signin(formData)
                .then(function (response) {
                    if (response.data.success) {
                        console.log("login successfully!");
                        var token = response.data.token;
                        successAuth($scope, token);
                    }
                    else {
                        $scope.pdErrorMsg = response.data.error;
                    }
                });
        };

        self.getCodeByEmail = function (email) {
            console.log(email);
            Auth.getCodeByEmail(email)
                .then(function (response) {
                    console.log(response.data);
                    if (response.data.success) {
                        console.log("get email code successfully!");
                    }
                    else {
                        $scope.emlErrorMsg = response.data.error;
                    }
                });
        }

        $scope.signup = function () {
            var formData = {
                email: $scope.email,
                password: $scope.password
            };

            Auth.signup(formData, successAuth, function (res) {
                $rootScope.error = res.error || 'Failed to sign up.';
            })
        };



        self.loginBySocialMedia = function(method) {
            console.log(method);
            User.loginBySocialMedia(method)
                .then(function(response) {
                    console.log(response.data);
                });
        }

        self.logout = function () {
            Auth.logout();
        }

        self.renderHtml = function (html_code) {
            return $sce.trustAsHtml(html_code);
        }
    }
})();