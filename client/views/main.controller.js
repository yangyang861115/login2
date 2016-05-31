/**
 * Created by yangyang on 3/31/16.
 */
(function () {
    angular
        .module("LoginApp")
        .controller("MainController", MainController);

    function MainController($scope, $localStorage, User, Auth, $rootScope,$sce) {
        var vm = this;

        vm.isAuthed = function () {
            return Auth.isAuthed();
        }

        function successAuth($scope, token) {
            window.location = "#/dashboard";
        }

        vm.signin = function (formData) {
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

        vm.getCodeByEmail = function (email) {
            User.getCodeByEmail(email)
                .then(function (response) {
                    if (response.data.success) {
                        vm.codeSent = true;
                    }
                    else {
                        vm.emlErrorMsg = response.data.error;
                    }
                });
        }

        vm.subEmailCode = function(data) {
            if(data.sixcnt && data.sixcnt.toString().length == 6) {
                console.log(data);
                User.subEmailCode(data)
                    .then(function (response) {
                        console.log(response.data);
                        if (response.data.success) {
                            console.log("Submit email code successfully!");
                            var token = response.data.token;
                            successAuth($scope, token);
                            vm.codeSent = false;
                        }
                        else {
                            vm.emlcodeErrorMsg = response.data.msg;
                        }
                    });
            }
        }

        vm.signup = function () {
            var formData = {
                email: $scope.email,
                password: $scope.password
            };

            Auth.signup(formData, successAuth, function (res) {
                $rootScope.error = res.error || 'Failed to sign up.';
            })
        };



        vm.loginBySocialMedia = function(method) {
            console.log(method);
            User.loginBySocialMedia(method)
                .then(function(response) {
                    console.log(response.data);
                });
        }

        vm.logout = function () {
            Auth.logout();
        }

        vm.renderHtml = function (html_code) {
            return $sce.trustAsHtml(html_code);
        }
    }
})();