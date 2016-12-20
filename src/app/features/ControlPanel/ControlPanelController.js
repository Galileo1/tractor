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
        this.tags = (config.tags ? getFilteredTags(config.tags) : [] );

        var environment;
        var tag;        
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
            tag: {
                get: function () {
                    return tag;
                },
                set: function (newTag) {
                    tag = newTag;                    
                }
            },
         });
     
        this.environment = _.first(this.environments);
        this.tag = _.first(this.tags);
        this.maxInstance = _.first(this.maxInstances);      
    }

    ControlPanelController.prototype.runProtractor = function () {
        this.runnerService.runProtractor({
            tag: this.tag,
            instances : this.maxInstance
        });
    };

    ControlPanelController.prototype.maxInstances = ['1', '2', '3', '4', '5'];

    ControlPanelController.prototype.isServerRunning = function () {
        return this.serverStatusService.isServerRunning();
    };

    return ControlPanelController;
})();

function getFilteredTags (tags) {
    var filterTags = tags.filter(function(item)  { 
        return (item.indexOf('breakpoint') === -1)
    });
    return  _.each(filterTags, function (item) {
        if(item != '') return filterTags.push('~'+item)
    });
}

ControlPanel.controller('ControlPanelController', ControlPanelController);
