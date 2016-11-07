'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ControlPanel = require('./ControlPanel');

// Dependencies:
//require('./Services/RunnerService');
require('../../Core/Services/RunnerService')
require('./Services/ServerStatusService');

var ControlPanelController = (function () {
    var ControlPanelController = function ControlPanelController (
        runnerServices,
        serverStatusService,
        config
    ) {
        this.runnerServices = runnerServices;
        this.serverStatusService = serverStatusService;

        this.environments = config.environments;

        var environment;
        Object.defineProperty(this, 'environment', {
            get: function () {
                return environment;
            },
            set: function (newEnv) {
                environment = newEnv;
                runnerServices.baseUrl = environment;
            }
        });
        this.environment = _.first(this.environments);
    }

    ControlPanelController.prototype.runProtractor = function () {
        this.runnerServices.runProtractor();
    };

    ControlPanelController.prototype.isServerRunning = function () {
        return this.serverStatusService.isServerRunning();
    };

    return ControlPanelController;
})();

ControlPanel.controller('ControlPanelController', ControlPanelController);
