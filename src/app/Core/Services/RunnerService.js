'use strict';

// Module:
//var ControlPanel = require('../ControlPanel');

// Module:
var Core = require('../Core');

// Dependencies:
require('../Components/Notifier/NotifierService');

var RunnerService = function RunnerService (
    notifierService,
    realTimeService
) {
    this.baseUrl = null;
    this.featureArray = [];

    return {
        runProtractor: runProtractor
    };

    function runProtractor (options) {        
        options = options || {};
        options.baseUrl = this.baseUrl;
        options.featureArray = this.featureArray;        
        var connection = realTimeService.connect('run-protractor', {
            'protractor-out': notify,
            'protractor-err': notify
        });
        connection.emit('run', options);
    }

    function notify (data) {
        notifierService[data.type](data.message);
    }

};

Core.service('runnerServices', RunnerService);