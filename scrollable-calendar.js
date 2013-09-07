var module = angular.module('scrollableCalendarModule', []);

module.controller('scrollableCalendarController', function($scope) {
    $scope.setup = function(baseDate) {
        var day = moment(baseDate).utc();
        day.startOf('month');  // first day of the month
        day.startOf('week');   // first day of the week (the row)
        return day;
    }
    $scope.computeDimentions = function(element) {
        var parentWidth = jQuery(element).innerWidth() - 20 /* scroll bar */;
        var width = Math.floor(parentWidth / 7);
        $scope.unitWidth = width;
    }
    $scope.generateRow = function(param) {
        var day = param.clone();
        var html = jQuery('<div class="cal-row"></div>');
        for (var i = 0; i < 7; ++i) {
            var dayDiv = jQuery('<div class="col-column"></div>');
            // dayDiv.text(day.utc().format('MMM D'));
            dayDiv.css({'width': $scope.unitWidth + "px"});
            dayDiv.css({'height': $scope.unitWidth + "px"});

            var dayMonth = jQuery('<div class="cal-day-month"></div>');
            dayMonth.css({'height':  $scope.unitWidth / 3 + "px"});
            if (day.date() == 1) {
                dayMonth.text(day.utc().format('MMM'))
            }
            var dayNumber = jQuery('<div class="cal-day-number"></div>');
            dayNumber.css({'height': 2 * $scope.unitWidth / 3 + "px"});
            dayNumber.css({'line-height': 2 * $scope.unitWidth / 3 + "px"});

            dayNumber.text(day.utc().format('D'))

            dayDiv.append(dayMonth);
            dayDiv.append(dayNumber);

            html.append(dayDiv);
            day.add('days', 1);
        }
        return html;
    }
    $scope.setupHeading = function(inputDay) {
        var day = inputDay.clone();
        var height = $scope.unitWidth * 1.5;
        $scope.head.css({'height':height});
        $scope.headYear = jQuery('<div id="cal-head-year"></div>');
        $scope.headYear.css({'height':$scope.unitWidth, 'width': $scope.unitWidth * 7});

        $scope.headYear.text(day.format('YYYY'));

        $scope.headDayOfWeek = jQuery('<div id="cal-head-dow"></div>');
        $scope.headDayOfWeek.css({'height':$scope.unitWidth*0.5});

        for (var i = 0; i < 7; ++i) {
            var dayDiv = jQuery('<div class="col-column"></div>');
            dayDiv.text(day.utc().format('ddd'));
            dayDiv.css({'width': $scope.unitWidth + "px"});
            $scope.headDayOfWeek.append(dayDiv);
            day.add('days', 1);
        }
        $scope.head.append($scope.headYear);
        $scope.head.append($scope.headDayOfWeek);
    }
    $scope.setupBody = function(parentElement) {
        var height = parentElement.innerHeight() - $scope.head.innerHeight();
        $scope.body.css({'height': height});
    }
    $scope.refreshHeading = function() {
        var top = $scope.body.scrollTop();
        var height = $scope.body[0].scrollHeight;
        var visibleHeight = $scope.body.innerHeight();
        var bottom = top + visibleHeight;

        var centerDay = $scope.beginDay.clone();
        centerDay.add('days', Math.floor((top + visibleHeight/2) / $scope.unitWidth) * 7);

        $scope.headYear.text(centerDay.format('YYYY MMMM'));
    }
});
module.directive('scrollableCalendar', function() {
   return {
       restrict: 'A',
       controller: 'scrollableCalendarController',
       template: '<div class="cal-head"></div><div class="cal-body"></div>',
       link: function($scope, $element, $attrs) {
           $scope.computeDimentions($element);
           $scope.body = jQuery($element).find(".cal-body");
           $scope.head = jQuery($element).find(".cal-head");

           var day = $scope.setup($attrs.baseDate);
           $scope.setupHeading(day);
           $scope.setupBody($element);
           // going back 300px
           var hiddenNumRows = Math.floor(300 / $scope.unitWidth);
           day.subtract('days', 7 * hiddenNumRows);
           $scope.beginDay = day.clone();
           for (var i = 0; i < 50; ++i) {
               var rowElement = $scope.generateRow(day);
               $scope.body.append(rowElement);
               day.add('days', 7);
           }
           var endDay = day.clone();
           $scope.body.scrollTop(hiddenNumRows * $scope.unitWidth);
           $scope.refreshHeading();
           $scope.body.bind('scroll', function(event_info) {
               var top = $scope.body.scrollTop();
               var height = $scope.body[0].scrollHeight;
               var visibleHeight = $scope.body.innerHeight();
               var bottom = top + visibleHeight;
               if (top < 100) {
                   // create rows
                   var hiddenNumRows = Math.floor(300 / $scope.unitWidth);
                   for (var i = 0; i < hiddenNumRows; ++i) {
                       $scope.beginDay.subtract('days', 7);
                       var rowElement = $scope.generateRow($scope.beginDay);
                       $scope.body.prepend(rowElement);
                   }
                   jQuery($scope.body).scrollTop(top + hiddenNumRows * $scope.unitWidth);
               } else if ((height - bottom) < 100) {
                   // create rows at the bottom
                   var hiddenNumRows = Math.floor(300 / $scope.unitWidth);
                   for (var i = 0; i < hiddenNumRows; ++i) {
                       var rowElement = $scope.generateRow(endDay);
                       $scope.body.append(rowElement);
                       endDay.add('days', 7);
                   }
               }
               $scope.refreshHeading();
           });
       }
    };
});