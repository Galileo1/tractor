'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ControlPanel = require('./ControlPanel');

// Dependencies:
require('./Services/RunnerService');
require('./Services/ServerStatusService');

var ControlPanelController = (function () {
    var ControlPanelController = function ControlPanelController (
        runnerService,
        serverStatusService,
        config
    ) {
        this.runnerService = runnerService;
        this.serverStatusService = serverStatusService;

        this.environments = config.environments;

        var environment;
        Object.defineProperty(this, 'environment', {
            get: function () {
                return environment;
            },
            set: function (newEnv) {
                environment = newEnv;
                runnerService.baseUrl = environment;
            }
        });
        this.environment = _.first(this.environments);
        this.maxInstance = _.first(this.maxInstances)
    }

    ControlPanelController.prototype.runProtractor = function () {
        this.runnerService.runProtractor({           
           // instances : this.maxInstance
        });        
    };

    ControlPanelController.prototype.maxInstances = ['1', '2', '3', '4', '5'];

    ControlPanelController.prototype.isServerRunning = function () {
        return this.serverStatusService.isServerRunning();
    };

    return ControlPanelController;
})();

ControlPanel.controller('ControlPanelController', ControlPanelController);
