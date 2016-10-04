'use strict';

/* eslint-disable no-var, prefer-arrow-callback */
var HttpBackend = require('httpbackend');
var reporter = require('cucumber-html-reporter');
var Cucumber = require('cucumber');
var path = require('path');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

var CustomWorld = (function () {
    var chai = require('chai');
    var chaiAsPromised = require('chai-as-promised');
    var CustomWorld = function CustomWorld () {
        global.By = global.protractor.By;
        chai.use(chaiAsPromised);
        global.expect = chai.expect;
        global.Promise = require('bluebird');
    };

    return CustomWorld;
})();

module.exports = function () {
    this.World = function (callback) {
        var w = new CustomWorld();
        return callback(w);
    };

    // TODO: Get rid of `singleFeature` here. It works ok,
    // but I’d rather see if there’s a way to get the number of
    // specs from within the `StepResult` hook…
    var singleFeature = false;
    /* eslint-disable new-cap */
    this.Before(function (scenario, callback) {
    /* eslint-enable new-cap */
        global.httpBackend = new HttpBackend(global.browser);
        global.browser.getProcessedConfig()
        .then(function (value) {
            if (value.specs.length === 1) {
                singleFeature = true;
            }
            callback();
        });
    });

    // /* eslint-disable new-cap */
     this.StepResult(function (event, callback) {
         var stepResult;
         if (singleFeature) {
             stepResult = event.getPayloadItem('stepResult');
             if (stepResult.isFailed()) {
                // global.browser.pause();
             }
         }
         callback();
     });

    /* eslint-disable new-cap */
    this.After(function (scenario, callback) {
    /* eslint-enable new-cap */
        global.httpBackend.clear();
        global.browser.manage().deleteAllCookies();
        global.browser.executeScript('window.sessionStorage.clear();');
        global.browser.executeScript('window.localStorage.clear();');

        if (scenario.isFailed()) {
            Promise.all([takeScreenshot(scenario), printBrowserLog()])
            .then(function () {
                callback();
            })
            .catch(function (err) {
                callback(err)
            });
        } else {
            callback();
        }

        function takeScreenshot (scenario) {
            return global.browser.takeScreenshot()
            .then(function (base64png) {
                var decodedImage = new Buffer(base64png, 'base64').toString('binary');
                scenario.attach(decodedImage, 'image/png');
            });
        }

        function printBrowserLog () {
            return global.browser.manage().logs().get('browser')
            .then(function (browserLog) {
                var severeErrors = browserLog.filter(function (log) {
                    return log.level.name === 'SEVERE';
                })
                .map(function (log) {
                    return log.message.substring(log.message.indexOf('Error'), log.message.indexOf('\n'));
                });

                var uniqueErrors = {};
                if (severeErrors) {
                    severeErrors.forEach(function (message) {
                        uniqueErrors[message] = true;
                    });
                    Object.keys(uniqueErrors).map(function (message) {
                        console.error(message);
                    });
                }
            });
        }
    });

    var jsonFormatter = Cucumber.Listener.JsonFormatter();
    this.AfterFeatures(function (features, callback) {        
         var outputDir = path.join(__dirname, '../', 'report')
         jsonFormatter.log = jsonReportWriter;


         function jsonReportWriter (content) {
            var jsonFileName = getFileName('cucumberReport_', 'json');
            var cucumberReport = path.join(outputDir, jsonFileName);
            fs.writeFileAsync(cucumberReport, content)
                /* eslint-disable prefer-arrow-callback */
            .then(function () {
                return htmlReportWriter(cucumberReport);
            })
                /* eslint-disable prefer-template */
            .catch(function (error) {
                console.log('Failed to save test results to json file. ' + error);
            });
         }

        function htmlReportWriter (cucumberReport) {
            var htmlFileName = getFileName('tractorReport_', 'html');
            var outputFileName = path.join(outputDir, htmlFileName)
            var options = {
                theme: 'bootstrap',
                jsonDir: outputDir,
                output: outputFileName,
                reportSuiteAsScenarios: true
            };
            reporter.generate(options);
        }

        function getFileName (file, extension) {
            /* eslint-disable prefer-template */
            return file + new Date().toLocaleString().replace(/[\/\\:]/g,"-") + '.' + extension;
        }

        callback();
    });

    this.registerListener(jsonFormatter);

    return this.World;
};
