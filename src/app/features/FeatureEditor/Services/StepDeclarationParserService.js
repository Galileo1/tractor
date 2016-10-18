'use strict';

// Module:
var FeatureEditor = require('../FeatureEditor');
var _ = require('lodash');

// Dependencies
require('../Models/StepDeclarationModel');

var StepDeclarationParserService = function ExampleParserService (StepDeclarationModel) {
    return {
        parse: parse
    };

    function parse (feature, tokens) {
        var stepDeclaration = new StepDeclarationModel();

        stepDeclaration.type = tokens.type;
        stepDeclaration.step = tokens.step;
        
        _.each(feature.availableStepDefinitions, function(stepDefinition) {     
            var notIsPending = false;
            var stepDefinitionSteps =  removeSpecialCharacters(stepDefinition.name);
            var tokensSteps =  removeSpecialCharacters(tokens.step);
            
            try {            
                if (stepDefinitionSteps === tokensSteps) {               
                    stepDeclaration.isPending =  (stepDefinition.isPending ?  true : false);
                }
                return        
            } catch (e) { 
                notIsPending = true;
            }

            if (notIsPending) {
                 console.warn('Invalid stepDeclaration:', stepDeclaration);
            }
        });
          
        return stepDeclaration;
    }

    function removeSpecialCharacters(stringToScan){
        return stringToScan.replace(/[~`!#$%_\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g,'');
    }
};

FeatureEditor.service('StepDeclarationParserService', StepDeclarationParserService);
