/**
 * Created by yangyang on 3/31/16.
 */
(function () {
    angular
        .module("myApp")
        .factory('Auth', auth);
    function auth($window) {

        var api = {
            parseJwt: parseJwt,
            saveToken: saveToken,
            getToken: getToken,
            isAuthed: isAuthed,
            logout: logout,
            saveRememberMeCookie: saveRememberMeCookie,
            deleteRememberMeCookie: deleteRememberMeCookie,
            validateRememberMeCookie: validateRememberMeCookie
        }

        // Add JWT methods here
        function parseJwt(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        };

        function saveToken(token, callback) {
            $window.sessionStorage['jwtToken'] = token;
            if (callback) {
                callback();
            }
        };

        function getToken() {
            return $window.sessionStorage['jwtToken'];
        };


        function isAuthed() {
            var token = getToken();
            if (token) {
                //var params = self.parseJwt(token);
                //return Math.round(new Date().getTime() / 1000) <= params.exp;
                return true;
            } else {
                return false;
            }
        };

        function logout() {
            $window.sessionStorage.removeItem('jwtToken');
            deleteRememberMeCookie();
            window.location = "#/login";
        }

        function saveRememberMeCookie(token) {
            var cookie = "remember-me=" + token + ";";
            var date = new Date();
            date.setDate(date.getDate() + 7);
            cookie += 'expires=' + date.toString() + ';';
            document.cookie = cookie;
        }

        function deleteRememberMeCookie() {
            var cookie = "remember-me=;";
            cookie += 'expires=' + (new Date()).toString() + ';';
            document.cookie = cookie;
        }

        function validateRememberMeCookie() {
            var cookie = document.cookie;
            if (cookie && cookie.indexOf('remember-me') != -1) {
                return true;
            }
            return false;
        }

        return api;
    }

})();