/**
 * Created by yangyang on 4/24/16.
 */
(function(){
    angular
        .module("LoginApp")
        .controller("RedirectController", redirectController);
    function redirectController ($routeParams, $window, User, Auth) {
        var vm = this;

        function init(){
            //vm.token = $routeParams.tokenstring;
            Auth.saveToken($routeParams.tokenstring, function(){
                User.validateToken()
                    .then(function(response) {

                        if (response.data.success) {
                            console.log("login successfully!");
                            window.location = "#/dashboard";
                        }
                        else {
                            $window.localStorage.removeItem('jwtToken');
                            window.location = "#/login";
                            alert("invalid token");
                        }

                    });
            });


        }
        init();

        // validate the token https://crucore.com/api.php?a=validate

        ////$scope.token = $localStorage.token;

    }
})();