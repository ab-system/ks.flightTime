/**
 * Created by eolt on 25.09.2015.
 */

(function() {

    var separator = '.';

    function throwWrongFormat(value, format) {
        var nl = '\r\n';
        var msg = 'flightTimeFilter: wrong format.' + nl +
            '          value:' + value + nl +
            'expected format:' + format;
        throw msg;
    }

    function getOtherParts(partsLength, splitted_1){
        var otherPartsLen = partsLength.slice(1, partsLength.length);
        var startIndex = 0;
        var parts = [];
        if(splitted_1) {
                parts = _.map(otherPartsLen, function (len) {
                var part = splitted_1.substr(startIndex, len);
                startIndex += len;
                return part;
            });
        }
        return {
            parts : parts,
            len: otherPartsLen
        };
    }

    function getPartsLength(format){
        var totalLength = 0;
        var splittedFormat = format.split(separator);
        var  partsLength = _.map(splittedFormat, function (val) {
            totalLength += val.length;
            return val.length;
        });

        return {
            totalLength: totalLength,
            partsLength: partsLength,
            splittedFormat: splittedFormat
        };
    }

    function addChar(value, expectLen, func) {
        if (value.length > expectLen) {
            var nl = '\r\n';
            var message = 'value.length more than expected length' + nl
                + '       value: ' + value + nl
                + 'value.length: ' + value.length + nl
                + '   expectLen: ' + expectLen;
            throw message;
        }
        while (value.length < expectLen) {
            value = func(value);
        }
        return value;
    }

    function addCharToStart(value, expectLen, char) {
        function func(val) {
            return char + val;
        }

        return addChar('' + value, expectLen, func);
    }

    function addCharToEnd(value, expectLen, char) {
        function func(val) {
            return val + char;
        }

        return addChar('' + value, expectLen, func);
    }

    angular
        .module('ks.flightTime', ['ks.upDown'])
        .value('flightTimeUpDownSettings', { templateUrl: 'src/ks.flightTime.html' })
        .filter('flightTime', function(){
            return function(input, format, units){
                if(input) {

                    if (!format) {
                        throw 'format is required';
                    }
                    var inputStr = '' + input;
                    var splittedVal = inputStr.split('.');

                    if(splittedVal.length > 2 || splittedVal.length == 0) {
                        throwWrongFormat(input, format);
                    }

                    var l = getPartsLength(format);
                    var splittedFormat = l.splittedFormat;
                    var totalLength = l.totalLength;
                    var partsLength = l.partsLength;

                    var splittedUnits;
                    if(units)
                    {
                        splittedUnits = units.split('.');
                    }
                    else {
                        splittedUnits = _.map(splittedFormat, function(f){ return f[0]; });
                    }

                    input = splittedVal[0] + ' ' + splittedUnits[0];

                    if (partsLength.length > 1) {
                        var otherParts = getOtherParts(partsLength, splittedVal[1]);
                        _.each(otherParts.parts, function (part, index) {
                            if(part) {
                                part = addCharToEnd(part, partsLength[index + 1], 0)
                                input += ' ' + part + ' ' + splittedUnits[index + 1];
                            }
                        });
                    }
                }
                return input;
            }
        })
        .directive("flightTimeUpDown", [
            '$log', 'flightTimeUpDownSettings', function ($log, flightTimeUpDownSettings) {

                function getMaxInt(digitsCount){
                    var max = 0;
                    for(var i = 0; i < digitsCount; i++)
                    {
                        max += Math.pow(10, i) * 9;
                    }
                    return max;
                };

                return {
                    restrict: "EA",
                    require: 'ngModel',
                    scope: {
                        format: '@',
                        labels: '@'
                    },

                    templateUrl: flightTimeUpDownSettings.templateUrl,

                    link: function link(scope, element, attrs, ngModelCtrl) {



                        var format = scope.format;
                        var l = getPartsLength(format);
                        var partsLength = l.partsLength;

                        var labels;
                        if(scope.labels){
                            labels = scope.labels.split('.');
                            if(labels.length != partsLength.length){
                                throw "Wrong labels: " + scope.labels + " for format: " + format;
                            }
                        }

                        scope.viewModels = [];

                        scope.viewModels.push({ label: labels ? labels[0] : null, max: getMaxInt(partsLength[0]), min: 0, value: 0, onChange: ngModelCtrl.$setViewValue });

                        if (partsLength.length > 1) {
                            for(var i = 0; i < partsLength.length - 1; i++){
                                scope.viewModels.push({ label: labels ? labels[i + 1] : null, max: 60, min: 0, value: 0, onChange: ngModelCtrl.$setViewValue });
                            }
                        }

                        ngModelCtrl.$formatters.push(function (modelValue) {
                            if (modelValue) {
                                var inputStr = '' + modelValue;
                                var splitted = inputStr.split(separator);

                                if (splitted.length > 2 || splitted.length == 0) {
                                    throwWrongFormat(modelValue, format);
                                }

                                scope.viewModels[0].value = splitted[0];

                                if (partsLength.length > 1) {
                                    var otherParts = getOtherParts(partsLength, splitted[1]);
                                    _.each(otherParts.parts, function (part, index) {
                                        if (part.length < otherParts.len[index]) {
                                            part = addCharToEnd(part, otherParts.len[index], 0);
                                        }
                                        scope.viewModels[index + 1].value = part;
                                    })
                                }
                            }
                            return modelValue;
                        });

                        ngModelCtrl.$parsers.push(function (viewValue) {
                            viewValue = '' + scope.viewModels[0].value;
                            if(scope.viewModels.length > 1) {
                                viewValue += '.';
                                for (var i = 1; i < scope.viewModels.length; i++) {
                                    var expectLen = l.partsLength[i];
                                    viewValue += addCharToStart(scope.viewModels[i].value, expectLen, '0');
                                }
                            }
                            return viewValue;
                        });

                    }


                };
            }
        ]);
})();