/**
 * Created by yangyang on 3/31/16.
 */
(function () {
    angular
        .module("LoginApp")
        .factory('User', user);
    function user($http) {

        var api = {
            signup: signup,
            signin: signin,
            getCodeByEmail: getCodeByEmail,
            subEmailCode: subEmailCode,
            validateToken: validateToken,
            getProfile: getProfile,
            updateProfile: updateProfile
        }


        function signup(data, success, error) {
            var url = "no url yet";
            $http.post(url, data).success(success).error(error)
        }

        function signin(data) {
            var url = "https://crucore.com/api.php?a=login";
            return $http.post(url, data);
        }


        function getCodeByEmail(email) {
            var data = {
                email: email
            };
            var url = "https://crucore.com/api.php?a=sendEmail";
            return $http.post(url, data);
        }

        function subEmailCode(data) {
            var url = "https://crucore.com/api.php?a=entercode";
            return $http.post(url, data);
        }



        function validateToken() {
            var url = "https://crucore.com/api.php?a=validate";
            return $http.get(url);
        }

        function getProfile() {
            var url = "https://crucore.com/api.php?a=profile";
            return $http.get(url);
        }

        function updateProfile(data) {
            var url = "https://crucore.com/api.php?a=profile";
            return $http.post(url, data);
        }

        return api;
    }

})();