'use strict';
exports.config = {
    allScriptsTimeout: 11000,
    specs: ['features/**/*.feature'],
    // capabilities: { 'browserName': 'chrome' },
    capabilities: {
      'browserName': 'chrome',
      // This install's adblocker when chrome spins up. It will only work if you have access to below folder, Please leave commented out!
    //'chromeOptions': {
     //    'args': ['--load-extension=' + 'T:\\Test\\Private\\NextGen\\gighmmpiobklfepjocnamgkkbiglidom\\3.2.0_0']
     // }
      'shardTestFiles': true,
      'maxInstances': 0
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
