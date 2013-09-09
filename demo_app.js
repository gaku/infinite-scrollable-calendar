var app = angular.module('demoApp', ['scrollableCalendarModule']);

app.controller('demoAppController', function($scope) {
    $scope.startDate = '2014-09-19';
    $scope.endDate = '2014-09-27';
    $scope.updated = function(start, end) {
        console.log('updated:' + start + ',' + end);
    }
});