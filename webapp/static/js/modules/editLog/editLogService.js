define(['angular'], function (angular) {
    'use strict';

    angular.module('editLog.service', ['common.service'])
        .service('editLogService', editLogService);

    editLogService.$inject = ['httpService'];
    function editLogService(httpService) {
        this.getDog = getDog;
        this.getExercises = getExercises;
        this.getFoods = getFoods;
        this.addNewActivity = addNewActivity;
        this.addNewFood = addNewFood;
        this.addLog = addLog;

        function getDog(id) {
            return httpService.post('/dog', {
                id: id
            });
        }

        function addNewActivity(activity, description) {
            return httpService.post('/exercise/new', {
                activity: activity,
                description: description
            });
        }

        function getExercises() {
            return httpService.post('/exercise/all', {});
        }

        function addNewFood(food, calories, serving) {
            return httpService.post('/food/new', {
                food: food,
                calories: calories,
                serving: serving
            });
        }

        function getFoods() {
            return httpService.post('/food/all', {});
        }

        function addLog(log) {
            log.exercise = _.values(log.exercise);
            log.food = _.values(log.food);
            return httpService.post('/log/new', log);
        }
    }
});
