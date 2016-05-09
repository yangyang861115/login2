/**
 * Created by yangyang on 5/9/16.
 */
(function () {
    angular
        .module("LoginApp")
        .controller("DashboardController", dashboardController);

    function dashboardController(User){
        var vm = this;
        vm.getProfile = getProfile;

        function getProfile(){
            User.getProfile()
                .then(function(response) {
                    console.log(response);
                    vm.data = response.data;
                });
        }
    }

})();