'use strict';

/* eslint-disable no-var, prefer-arrow-callback */
var cucumber = require('cucumber');
var path = require('path');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

function createReporter () {
    /* eslint-disable new-cap */
    var jsonFormatter = cucumber.Listener.JsonFormatter();
    var outputDir = path.join(__dirname, '../', 'report', 'now')
    jsonFormatter.log = jsonReportWriter;
    return jsonFormatter;

    function jsonReportWriter (content) {
        var jsonFileName = getFileName('cucumberReport_', 'json');
        var cucumberReport = path.join(outputDir, jsonFileName);
        fs.writeFileAsync(cucumberReport, content)
         /* eslint-disable prefer-template */
        .catch(function (error) {
            console.log('Failed to save test results to json file. ' + error);
        });
    }

    function getFileName (file, extension) {
        /* eslint-disable prefer-template */
        return file + new Date().toLocaleString().replace(/[\/\\:]/g, "-") + '.' + extension;
    }

}
        
module.exports = function () {
    var reporter = createReporter();
    this.registerListener(reporter);
};
