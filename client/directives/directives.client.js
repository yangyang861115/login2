/**
 * Created by yangyang on 6/13/16.
 */
(function(){
    angular
        .module("myApp")
        .directive('username', function ($q, $timeout, User) {
            return {
                require: 'ngModel',
                scope: {
                    "recno": "=recno",
                    "email": "=email"
                },
                link: function (scope, elm, attrs, ctrl) {

                    ctrl.$asyncValidators.username = function (modelValue, viewValue) {

                        if (ctrl.$isEmpty(modelValue)) {
                            // consider empty model valid
                            return $q.when();
                        }

                        var def = $q.defer();

                        $timeout(function () {
                            // Mock a delayed response
                            if (modelValue && modelValue.length >= 6 && modelValue.length <= 30) {
                                //check if it is an email
                                var emailsArray = modelValue.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
                                if (emailsArray != null && emailsArray.length && modelValue != scope.email) {
                                    //has email
                                    //console.log("modelValue " + modelValue);
                                    //console.log("email " + scope.email);
                                    //console.log("emailsArray" + emailsArray);
                                    //console.log("inside rejection for not the same emails");
                                    def.reject({message: "If you want to use an email address as your username, please use your email address above!"});
                                } else {
                                    var data = {
                                        username: modelValue
                                    };
                                    if (scope.recno) {
                                        data.recno = scope.recno;
                                    }
                                    User.checkEmail(data)
                                        .then(function (response) {
                                            if (response.data.success) {
                                                //do nothing
                                                def.resolve();
                                            }
                                            else {
                                                //console.log("inside rejection for the exists username");
                                                def.reject({message: "Username already exists! Please use another username."});
                                            }
                                        });
                                }

                            }
                            else {
                                def.resolve();
                            }
                        }, 2000);

                        return def.promise;
                    };
                }
            };
        })
        .directive('emailCheck', function ($q, $timeout, User) {
            return {
                require: 'ngModel',
                scope: {
                    "userid": "=userid",
                },
                link: function (scope, elm, attrs, ctrl) {

                    ctrl.$asyncValidators.email = function (modelValue, viewValue) {
                        if (ctrl.$isEmpty(modelValue)) {
                            // consider empty model valid
                            return $q.when();
                        }

                        var def = $q.defer();
                        $timeout(function () {
                            // Mock a delayed response
                            if (modelValue && scope.userid) {
                                var data = {
                                    email: modelValue,
                                    id: scope.userid
                                };
                                User.checkEmail(data)
                                    .then(function (response) {
                                        if (response.data.success) {
                                            //do nothing
                                            def.resolve();
                                        }
                                        else {
                                            //console.log("inside rejection for the exists email");
                                            def.reject({message: "email already exists! Please use another email."});
                                        }
                                    });
                            }
                            else {
                                def.resolve();
                            }
                        }, 2000);

                        return def.promise;
                    };
                }
            };
        });
})();