'use strict';
exports.config = {
    allScriptsTimeout: 11000,
    specs: ['features/**/*.feature'],
    seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
    // capabilities: { 'browserName': 'chrome' },
    capabilities: {
      'browserName': 'chrome',
      // This install's adblocker when chrome spins up. It will only work if you have access to below folder, Please leave commented out!
    //'chromeOptions': {
     //    'args': ['--load-extension=' + 'T:\\Test\\Private\\NextGen\\gighmmpiobklfepjocnamgkkbiglidom\\3.2.0_0']
     // }
      'shardTestFiles': true,
      'maxInstances': 2
},
    framework: 'cucumber',    
    cucumberOpts: {
        require: [
            'support/**/*.js',
            'step-definitions/**/*.js'
        ],
        format: 'pretty'
    }
};
