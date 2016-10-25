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
        this.featureTags  = config.featureTags;

        var environment;
        var featureTag;
         Object.defineProperties(this, {
            environment: {
                get: function () {
                    return environment;
                },
                set: function (newEnv) {
                    environment = newEnv;
                    runnerService.baseUrl = environment;
                }
            },
            featureTag: {
                get: function () {
                    return featureTag;
                },
                set: function (newTag) {
                    featureTag = newTag;
                    runnerService.featureTag = featureTag;
                }
            }
         });
        // Object.defineProperty(this, 'environment', {
        //     get: function () {
        //         return environment;
        //     },
        //     set: function (newEnv) {
        //         environment = newEnv;
        //         runnerService.baseUrl = environment;
        //     }
        // });       
        this.environment = _.first(this.environments);
    }

    ControlPanelController.prototype.runProtractor = function () {
        this.runnerService.runProtractor();
    };

    ControlPanelController.prototype.isServerRunning = function () {
        return this.serverStatusService.isServerRunning();
    };

    return ControlPanelController;
})();

ControlPanel.controller('ControlPanelController', ControlPanelController);
