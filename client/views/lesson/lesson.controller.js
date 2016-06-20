/**
 * Created by yangyang on 3/2/16.
 */
(function () {
    angular
        .module("myApp")
        .controller("LessonController", LessonController);

    function LessonController($location, $sce, $routeParams, LessonService) {
        var vm = this;
        vm.form = {};
        vm.renderHtml = renderHtml;
        vm.submit = submit;
        var study = $routeParams.study;
        var lesson = $routeParams.lesson;
        var page = $routeParams.page;
        var URL = "https://essentials24.net/api.php?a=less_info&i=";

        function init() {
            console.log("study= " + study + " lesson= " + lesson + " page= " + page);

            if (study != null && lesson != null && page != null) {
                URL += study + "." + lesson + "." + page;
            }
            else {
                URL += "4.1.1";
                study = 4;
                lesson = 1;
                page = 1;
                $location.url('/lesson/' + study + "/" + lesson + "/" + page);
            }

            LessonService
                .findLesson(URL)
                .then(function (response) {
                    console.log(response.data);
                    vm.lesson = response.data;
                    vm.form.ival = vm.lesson.ival;
                });
        }

        init();

        function renderHtml(html_code) {
            return $sce.trustAsHtml(html_code);
        }

        function submit(btn) {
            vm.form.btn = btn;

            LessonService
                .submitAns(URL, vm.form)
                .then(function (response) {
                    console.log(response.data);
                    if (response.data.success) {
                        vm.lesson = response.data;
                        page = vm.lesson.curpg;
                        $location.url('/lesson/' + study + "/" + lesson + "/" + page);
                    }
                });
        }
    }
})();