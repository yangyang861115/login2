/**
 * Created by yangyang on 3/31/16.
 */
(function () {
    angular
        .module("LoginApp")
        .controller("MainController", MainController);

    function MainController(User, Auth ,$sce) {
        var vm = this;

        vm.isAuthed = function () {
            return Auth.isAuthed();
        };

        function successAuth() {
            window.location = "#/dashboard";
        }

        //remember me cookie
        function saveRememberMeCookie(remember, token){
            if(remember) {
                Auth.saveRememberMeCookie(token);
            }
        }

        vm.signIn = function (formData) {
            console.log(formData);
            User.signIn(formData)
                .then(function (response) {
                    if (response.data.success) {
                        console.log("login successfully!");
                        var token = response.data.token;
                        saveRememberMeCookie(formData.remember, token);
                        successAuth();
                    }
                    else {
                        vm.pdErrorMsg = response.data.error;
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
        };

        vm.subEmailCode = function(data) {
            if(data.sixcnt && data.sixcnt.toString().length == 6) {
                User.subEmailCode(data)
                    .then(function (response) {
                        console.log(response.data);
                        if (response.data.success) {
                            console.log("Submit email code successfully!");
                            var token = response.data.token;
                            successAuth();
                            vm.codeSent = false;
                        }
                        else {
                            vm.emlcodeErrorMsg = response.data.msg;
                        }
                    });
            }
        };

        vm.checkEmail = function(emailData) {
            if(emailData.$valid){
                var data = {
                    email: emailData.$viewValue
                };
                User.checkEmail(data)
                    .then(function (response) {
                        if (response.data.success) {
                           //do nothing
                        }
                        else {
                            vm.emailExists = !response.data.success;
                        }
                    });
            }
        };

        vm.signUp = function (formData) {
            console.log(formData);
            User.signUp(formData)
                .then(function (response) {
                    console.log(response.data);
                    if (response.data.success) {
                        console.log("login successfully!");
                        var token = response.data.token;
                        saveRememberMeCookie(formData.remember, token);
                        successAuth();
                    }
                    else {
                        vm.newUsrErrorMsg = response.data.msg;
                    }
                });
        };


        vm.logout = function () {
            Auth.logout();
        };

        vm.renderHtml = function (html_code) {
            return $sce.trustAsHtml(html_code);
        }
    }
})();