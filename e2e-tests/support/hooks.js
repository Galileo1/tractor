'use strict';

/* eslint-disable no-var, prefer-arrow-callback */
var cucumber = require('cucumber');
var reporter = require('cucumber-html-reporter');
var log = require('npmlog');
var path = require('path');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));


function createReporter () {
    /* eslint-disable new-cap */
    var jsonFormatter = cucumber.Listener.JsonFormatter();    
    var mkDir =  getFileName('tractorDir_', null) 
    var baseDirReporting = path.join(__dirname, '../', 'report', mkDir)
    fs.mkdirAsync(baseDirReporting)   
    var outputDir = path.join(__dirname, '../', 'report')
    jsonFormatter.log = jsonReportWriter;
    return jsonFormatter;

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
            log.error('Failed to save test results to json file. ' + error);
        });
    }

    function htmlReportWriter (cucumberReport) {        
        var htmlFileName = getFileName('tractorReport_', 'html');
        var outputFile = path.join(outputDir , htmlFileName);
        var options = {
            theme: 'bootstrap',
            jsonDir: outputDir,
            output: outputFile,
            reportSuiteAsScenarios: true            
        };
        reporter.generate(options);
    }

    function getFileName (file, extension) {
        /* eslint-disable prefer-template */
        if (extension !== null) { 

            return file + new Date().toLocaleString().replace(/[\/\\:]/g,"-") + '.' + extension;

        } else  {

            return file + new Date().toLocaleString().replace(/[\/\\:]/g,"-");
        }
    }
}

module.exports = function () {
    var reporter = createReporter();
    this.registerListener(reporter);
};
