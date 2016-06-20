/**
 * Created by yangyang on 5/9/16.
 */
(function () {
    angular
        .module("myApp")
        .controller("DashboardController", dashboardController);

    function dashboardController(User, Auth, $location) {
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
        vm.changeRegionList = changeRegionList;
        vm.askForProfileMsg = false;
        function init() {
            //check token strt
            var tokenSet = Auth.parseJwt(Auth.getToken());
            if(tokenSet.fixpro) {
                vm.askForProfileMsg = true;
                getProfile();
            }
        }
        init();

        function changeRegionList(country) {
            console.log(country);
            var droplist = vm.regdrop;
            if(droplist.indexOf(country) > -1) {
                //should change the list items in the region/province/state and type to select
                //display label should change
                var index = -1;
                for(var i in vm.data) {
                    if(vm.data[i].name == 'region') {
                        index = i;
                        break;
                    }
                }
                vm.data[index].label = vm.regnames[country];

                var countryData = {
                    country: country
                };
                User.getCountryList(countryData)
                    .then(
                        function(res){
                            if(res.data.success){
                                console.log("list should be ......");
                                vm.data[index].lst  = res.data.lst;
                            }
                        },
                        function(err) {

                        }
                    );
                delete vm.data[i].value;
                vm.data[index].type = "select";

            } else {
                //its should change to the type of "text"
                //display label as 'region'
                for(var i in vm.data) {
                    if(vm.data[i].name == 'region') {
                        delete vm.data[i].lst;
                        delete vm.data[i].value;
                        vm.data[i].type = "text";
                        vm.data[i].label = "Region";
                        break;
                    }
                }

            }

        }

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

            vm.createUsername = false;
            vm.updatePwd = false;
            User.getProfile()
                .then(function (response) {
                    vm.datereq = response.data.datareq;
                    vm.regdrop = response.data.regdrop;
                    vm.regnames = response.data.regnames;


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
                    var country = null;
                    var regionIndex = null;
                    for (var i in response.data.data){
                        if(response.data.data[i].name == 'country') {
                            country = response.data.data[i].value;
                        }
                        if(response.data.data[i].name == 'region') {
                            regionIndex = i;
                        }
                    }
                    if(country && regionIndex && vm.regdrop.indexOf(country) > -1) {
                        response.data.data[regionIndex].label = vm.regnames[country];
                    }

                    vm.userninfo = response.data.userninfo;
                    vm.data = response.data.data;
                });
        }

        function updateProfile(form, data) {
            if(form.$invalid) {
                return;
            } else {
                if (vm.userninfo.recno == 'new' && !vm.createUsername) {
                    delete data['username'];
                    delete data['password'];
                    delete data['confirmPassword'];
                    delete data['remember'];
                }
                if (vm.userninfo.recno != 'new' && !vm.updatePwd) {
                    console.log("I am here........");
                    delete data['password'];
                    delete data['confirmPassword'];
                    delete data['remember'];
                }

                User.updateProfile(data)
                    .then(function (response) {
                        vm.askForProfileMsg = false;
                        if (response.data.success) {

                            vm.msg = response.data.msg;
                            vm.createUsername = false;
                            vm.updatePwd = false;

                            //remember me
                            if(data.remember) {
                                var token = Auth.getToken();
                                Auth.saveRememberMeCookie(token);
                            }

                            delete data['password'];
                            delete data['confirmPassword'];
                            delete data['remember'];
                        } else {
                            //vm.errormsg = response.data.msg;
                            alert(response.data.msg);
                        }
                    });
            }

        }

        function cancelUpdate() {
            vm.data = null;
        }


    }

})();