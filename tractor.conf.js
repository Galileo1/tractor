'use strict';

// ES2015:
var babel = require('babel/register');

// Utilities:
var Promise = require('bluebird');

// Dependencies:
var createTestDirectoryStructure = require('./server/cli/init/create-test-directory-structure');
var del = require('del');

// Constants:
var TRACTOR_E2E_TESTS_RUNNING = './tractor_e2e_tests_running';

module.exports = {
    environments: [
        'http://localhost:3000',
        'http://localhost:4000'
    ],
    scenarioTags:[
        '',
        '@smoke',
        '@breakpoint',
        '@ignore',
        '~@smoke',
        '~@breakpoint',
        '~@ignore'
    ],
    featureTags:[
        '',
        '@featuresmoke',
        '@featurebreakpoint',
        '@featureignore',
        '~@featuresmoke',
        '~@featurebreakpoint',
        '~@featureignore'
    ],
};
