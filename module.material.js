/**
 * Created by eolt on 02.06.2016.
 */

angular.module('components', ['flightTime', 'ngMaterial'])
    .run(['upDownSettings', 'flightTimeUpDownSettings', function(upDownSettings) {
        upDownSettings.templateUrl = 'bower_components/ks.upDown/src/templates/ks.updown.material.html';
    }])