/**
 * Created by yangyang on 5/9/16.
 */
(function () {
    angular
        .module("LoginApp")
        .controller("DashboardController", dashboardController);

    function dashboardController(User){
        var vm = this;
        vm.formData = {};
        vm.EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        vm.getProfile = getProfile;
        vm.updateProfile = updateProfile;

        function getProfile(){
            vm.msg = '';
            User.getProfile()
                .then(function(response) {
                    vm.data = response.data;
                });
        }

        function updateProfile(data){
            User.updateProfile(data)
                .then(function(response) {
                    if(response.data.success) {
                        vm.msg = response.data.msg;
                    } else {
                        var errormsg = response.data.msg;
                        alert(errormsg);
                    }
                });
        }
    }

})();