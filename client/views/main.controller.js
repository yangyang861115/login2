/**
 * Created by yangyang on 3/31/16.
 */
(function () {
    angular
        .module("myApp")
        .controller("MainController", MainController);

    function MainController(User, Auth, $sce) {
        var vm = this;

        vm.isAuthed = function () {
            return Auth.isAuthed();
        };

        function successAuth() {
            window.location = "#/dashboard";
        }

        //remember me cookie
        function saveRememberMeCookie(remember, token) {
            if (remember) {
                Auth.saveRememberMeCookie(token);
            }
        }

        vm.signIn = function (formData) {
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

        vm.subEmailCode = function (data) {
            if (data.sixcnt && data.sixcnt.toString().length == 6) {
                User.subEmailCode(data)
                    .then(function (response) {
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

        vm.checkEmail = function (emailData) {
            if (emailData.$valid) {
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

        //vm.checkUsername = function (formname, username, recno) {
        //
        //    var result;
        //    //if (username && username.length >= 6 && username.length <= 30) {
        //    var data = {
        //        username: username
        //    };
        //    if (recno) {
        //        data.recno = recno;
        //    }
        //
        //    User.checkUsername(data)
        //        .then(function (response) {
        //            if (response.data.success) {
        //                //do nothing
        //            } else {
        //                formname.username.$invalid = true;
        //                formname.username.$valid = false;
        //                formname.username.$error.validator = true;
        //                formname.username.$setValidity('validator', true);
        //                console.log("checking.....");
        //                console.log(formname.username);
        //            }
        //        });
        //};

        vm.signUp = function (formData) {
            User.signUp(formData)
                .then(function (response) {
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

        //check whether a string is an email address
        vm.isEmail = function (emailString) {
            if (emailString) {
                var emailsArray = emailString.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);

                if (emailsArray != null && emailsArray.length) {
                    //has email
                    return true;
                }
                return false;
            }
            return true;
        }

    }

})();