/**
 * Created by eolt on 08.10.2015.
 */

    angular.module('components', ['ks.flightTime'])
        .run(['upDownSettings', function(upDownSettings) {
            upDownSettings.templateUrl = 'bower_components/ks.upDown/src/templates/ks.updown.bootstrap.html';
        }]);