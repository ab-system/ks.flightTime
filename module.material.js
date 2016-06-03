/**
 * Created by eolt on 02.06.2016.
 */

angular.module('components', ['ks.flightTime', 'ngMaterial'])
    .run(['upDownSettings', function(upDownSettings) {
        upDownSettings.templateUrl = 'bower_components/ks.upDown/src/templates/ks.updown.material.html';
    }])