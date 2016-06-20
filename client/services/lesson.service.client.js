/**
 * Created by yangyang on 3/2/16.
 */
(function(){
    angular
        .module("myApp")
        .factory("LessonService", LessonService);

    function LessonService ($http){
        var api = {
            findLesson: findLesson,
            submitAns: submitAns
        };

        return api;

        function findLesson(url){
            return $http.get(url);
        }

        function submitAns (url, data){
            return $http.post(url, data);
        }
    }
})();