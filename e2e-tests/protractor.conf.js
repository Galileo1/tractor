'use strict';
var path = require('path');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));  
var outputDir = path.join(__dirname, 'report', 'now')

exports.config = {
    allScriptsTimeout: 11000,
    specs: ['features/**/*.feature'],
    capabilities: { 
        'browserName': 'chrome',
        'shardTestFiles': true,
        'maxInstances': 0
    },
    params: { debug: false },
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    cucumberOpts: {
        require: [
            'support/**/*.js',
            'step-definitions/**/*.js'          
        ],        
        format: 'pretty',
        tags: []
    },
    beforeLaunch: function beforeLaunch() {
        var prevOutputDir = path.join(__dirname, 'report', 'previous_'+ 
                            new Date().toLocaleString().replace(/[\/\\:]/g, "-"))
        if(fs.existsSync(outputDir)){
            fs.rename(outputDir, prevOutputDir, function(error) {
               if (error) {console.log('ERROR:Can\'t rename report folder: ' + error);}
               else { createDir (outputDir); }        
            });
        } else {
            createDir (outputDir);
        }  

        function createDir (outputDir) {
           fs.mkdirSync(outputDir, function(error){
               if(error) console.log('ERROR:Can\'t create report folder: ' + error);
            });
        }
    },
    afterLaunch:  function afterLaunch() {
        var cucumberHtmlReporter = require('cucumber-html-reporter');
        var cucumberhtmlReport = path.join(outputDir, 'tractorReport.html');       
        var options = {
            theme: 'bootstrap',
            jsonDir: outputDir,
            output: cucumberhtmlReport,
            reportSuiteAsScenarios: true,
            launchReport: true
        };

        cucumberHtmlReporter.generate(options);

    }
};
