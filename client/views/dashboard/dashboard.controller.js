/**
 * Created by yangyang on 5/9/16.
 */
(function () {
    angular
        .module("LoginApp")
        .controller("DashboardController", dashboardController);

    function dashboardController(User, Auth) {
        var vm = this;
        vm.formData = {};
        vm.EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        vm.PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}$/;
        vm.USERNAME_PATTERN = /^[a-zA-Z0-9\.@_]{6,30}$/;
        vm.convertToDate = convertToDate;
        vm.checkDateLimits = checkDateLimits;
        vm.getProfile = getProfile;
        vm.updateProfile = updateProfile;
        vm.cancelUpdate = cancelUpdate;


        function convertToDate(date) {
            return (new Date(formatDate(date)));
        }

        function checkDateLimits(selectedDate, min, max) {
            if (selectedDate == null || "") return true;
            var currentDate = new Date(selectedDate);
            var upperBounds = max;
            var lowerBounds = min;

            return currentDate <= upperBounds && currentDate >= lowerBounds;
        };

        function formatDate(datestr) {
            return datestr.replace(new RegExp("-", 'g'), "/");
        }


        function getProfile() {
            vm.msg = '';
            User.getProfile()
                .then(function (response) {
                    vm.datereq = response.data.datareq;
                    vm.open = function (name) {
                        vm.datereq[name].opened = !vm.datereq[name].opened;
                    };

                    for (var name in vm.datereq) {
                        //set datepicker
                        vm.datereq[name].dateOptions = {
                            maxDate: new Date(vm.datereq[name].max),
                            minDate: new Date(vm.datereq[name].min)
                        };
                    }
                    vm.data = response.data.data;
                    vm.userninfo = response.data.userninfo;
                });
        }

        function updateProfile(data) {
            //console.log(data);
            if (vm.userninfo.recno == 'new' && (typeof vm.createUsername == "undefined" || !vm.createUsername)) {
                delete data['username'];
                delete data['password'];
                delete data['confirmPassword'];
            }
            if (vm.userninfo.recno != 'new' && (typeof vm.updatePwd == "undefined" || !vm.updatePwd)) {
                delete data['password'];
                delete data['confirmPassword'];
            }
            console.log("Checking data .........");
            console.log(data);
            User.updateProfile(data)
                .then(function (response) {
                    if (response.data.success) {
                        vm.msg = response.data.msg;
                    } else {
                        //vm.errormsg = response.data.msg;
                        alert(response.data.msg);
                    }
                });
        }

        function cancelUpdate() {
            vm.data = null;
        }


    }

})();