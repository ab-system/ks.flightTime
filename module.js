/**
 * Created by eolt on 08.10.2015.
 */

    angular.module('components', ['ui.bootstrap', 'flightTime'])
        .run(['upDownSettings', 'flightTimeUpDownSettings', function(upDownSettings) {
            upDownSettings.templateUrl = 'bower_components/ks.upDown/src/templates/ks.updown.bootstrap.html';
        }])
        .controller('mainCtrl', [ '$scope', function($scope) {
            $scope.hhhhmm = '1429.06';

            $scope.hhhhmmss = '1429.06';

            $scope.hhm = '12.5';
        }]);