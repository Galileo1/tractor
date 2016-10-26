'use strict';

// Utilities:
var _ = require('lodash');
var Promise = require('bluebird');
var stripcolorcodes = require('stripcolorcodes');

var FileEditorController = (function () {
    var FileEditorController = function FileEditorController (
        $scope,
        $window,
        $state,
        confirmDialogService,
        persistentStateService,
        notifierService,
        FileService,
        FileModel,
        fileStructure,
        filePath
    ) {
        this.$scope = $scope;
        this.$window = $window;
        this.$state = $state;
        this.confirmDialogService = confirmDialogService;
        this.persistentStateService = persistentStateService;
        this.notifierService = notifierService;
        this.fileService = FileService;
        this.FileModel = FileModel;
        this.fileStructure = fileStructure;

        this.availableComponents = fileStructure.availableComponents;
        this.availableMockData = fileStructure.availableMockData;
        this.availableStepDefinitions = fileStructure.availableStepDefinitions;

        if (filePath) {
            this.fileService.openFile({ path: filePath.path }, this.availableComponents, this.availableMockData, this.availableStepDefinitions)
            .then(function (file) {
                this.fileModel = file;
                this.fileModel.references = getReferencesFiles(filePath.path, this.fileStructure.references);
            }.bind(this));
        } else if (FileModel && !this.fileModel) {
            this.newFile();
        }
        
        this.stepDefinitionsArray = [];
        this.stepNameArray = [];
    };

    FileEditorController.prototype.newFile = function () {
        if (this.fileModel) {
            this.$state.go('.', { file: null });
        }
        this.fileModel = new this.FileModel();
    };

    FileEditorController.prototype.saveFile = function () {
        var path = null;

        this.fileService.getPath({
            path: this.fileModel.path,
            name: this.fileModel.name
        })
        .then(function (filePath) {
            path = filePath.path;
            var exists = this.fileService.checkFileExists(this.fileStructure, path);

            if (exists) {
                this.confirmOverWrite = this.confirmDialogService.show();
                return this.confirmOverWrite.promise
                .finally(function () {
                    this.confirmOverWrite = null;
                }.bind(this));
            } else {
                return Promise.resolve();
            }
        }.bind(this))
        .then(function () {
            var self = this;
            var a;
            var b;
            if (this.fileModel.hasOwnProperty('asA')) {
                // getStepNamesStepDefs(this)
                // .then(function (data){
                //     console.log('data',data)
                //     checkIfStepExists(data)
                // })
                // return getStepNameForFeature(self)
                // .then(getExistingStepDefinitions.bind(self))
                // .then(checkIfStepExists.bind(self))
                // this.stepNameArray = getStepNameForFeature(this.fileModel.data);
                // this.stepDefinitionsArray = getExistingStepDefinitions(this.availableStepDefinitions);
                // checkIfStepExists(this)
               return getStepNameForFeature(self)
               .then (function (_resultA){
                   a = _resultA;
                   var self = self;
                   return getExistingStepDefinitions(self);
               }).then (function (_resultB){
                   console.log(a,_resultB)
               })            
               
              
                 

            } else {
                Promise.resolve();
            }          
        }.bind(this))
        .then(function () {            
            return this.fileService.saveFile({
                data: this.fileModel.data,
                path: path
            });
        }.bind(this))
        .then(function () {
            return this.fileService.getFileStructure();
        }.bind(this))
        .then(function (fileStructure) {
            this.fileStructure = fileStructure;
            this.fileService.openFile({ path: path }, this.availableComponents, this.availableMockData, this.availableStepDefinitions)
            .then(function (file) {
                this.fileModel = file;
                this.fileModel.references = getReferencesFiles(path, this.fileStructure.references);
            }.bind(this));
        }.bind(this))
        .catch(function (error) {
            this.notifierService.error('File was not saved.'+ error);
        }.bind(this));
    };

    FileEditorController.prototype.showErrors = function () {
        var fileEditor = this.fileEditor;
        if (fileEditor.$invalid) {
            _.each(Object.keys(fileEditor.$error), function (invalidType) {
                _.each(fileEditor.$error[invalidType], function (element) {
                    element.$setTouched();
                });
            });
            this.notifierService.error('Can\'t save file, something is invalid.');
        }
        return !fileEditor.$invalid;
    };

    FileEditorController.prototype.minimise = function (item) {
        item.minimised = !item.minimised;

        var displayState = this.persistentStateService.get(this.fileModel.name);
        displayState[item.name] = item.minimised;
        this.persistentStateService.set(this.fileModel.name, displayState);
    };

    //included relative stepDefinitions in references to components and mockData file model
    function getReferencesFiles(filePath,references){
        var referencesInstances = [];
        if (references[filePath]) {
            _.each(references[filePath], function(referencePath){
                var referenceModel = {
                    name : _.first( referencePath.substring(referencePath.lastIndexOf('\\') + 1,referencePath.lastIndexOf('.')).split(".") ),
                    path : referencePath
                };
                referencesInstances.push(referenceModel);
            });
        }
        return referencesInstances;
    }

    function getStepNameForFeature(self) {
        console.log("this: ",self.fileModel)     
        return new Promise(function (resolve, reject) {
            var stepNames = extractSteps(self.fileModel.data);
            resolve(
            _.each (stepNames, function (stepName){
                var stepNameStruct = {
                    name : stepName.substr(stepName.indexOf(" ") + 1),
                    type : _.first( stepName.split(" ") )
                }
                self.stepNameArray.push(stepNameStruct);
             })
           )       
        });      
    }

    // function getStepNameForFeature(featureContent) {
    //     console.log("this: ",featureContent)
    //     var  stepNameArray = []
       
    //         var stepNames = extractSteps(featureContent);
         
    //         _.each (stepNames, function (stepName){
    //             var stepNameStruct = {
    //                 name : stepName.substr(stepName.indexOf(" ") + 1),
    //                 type : _.first( stepName.split(" ") )
    //             }
    //            stepNameArray.push(stepNameStruct);
    //          })
               
    //      return stepNameArray;
    // }
    
    function extractSteps(featureFileContent) {
        var GIVEN_WHEN_THEN_REGEX = /^(Given|When|Then)/;
        var AND_BUT_REGEX = /^(And|But)/;       
        var NEW_LINE_REGEX = /\r\n|\n/;
                 
        return stripcolorcodes(featureFileContent)
        // Split on new-lines:
        .split(NEW_LINE_REGEX)
        // Remove whitespace:
        .map(line => line.trim())
        // Get out each step name:
        .filter((line) => GIVEN_WHEN_THEN_REGEX.test(line) || AND_BUT_REGEX.test(line))
        .map((stepName, index, stepNames) => {
            if (AND_BUT_REGEX.test(stepName)) {
                let previousType = _(stepNames)
                .take(index + 1)
                .reduceRight((p, n) => {
                    let type = n.match(GIVEN_WHEN_THEN_REGEX);
                    return p || _.last(type);
                }, null);
                return stepName.replace(AND_BUT_REGEX, previousType);
            } else {
                return stepName;
            }
        });       
    }

    function getExistingStepDefinitions(self){
       console.log("existing: ",self)       
       return new Promise(function (resolve, reject){
            resolve (
                 _.each(self.availableStepDefinitions, function(stepDefs){
                  var StepDefinitionStruct = {
                      name : stepDefs.name.substr(stepDefs.name.indexOf(" ") + 1),
                      type : _.first( stepDefs.name.split(" ") )
                  };
                self.stepDefinitionsArray.push(StepDefinitionStruct)
             })
            )
       })         
        
    }

    // function getExistingStepDefinitions(availableStepDefs){
    //    console.log("existing: ",availableStepDefs) 
    //    var  stepDefinitionsArray = [];     
     
    //              _.each(availableStepDefs, function(stepDefs){
    //               var StepDefinitionStruct = {
    //                   name : stepDefs.name.substr(stepDefs.name.indexOf(" ") + 1),
    //                   type : _.first( stepDefs.name.split(" ") )
    //               };
    //             stepDefinitionsArray.push(StepDefinitionStruct)
    //          })
    //         return stepDefinitionsArray;
              
        
    // } 



    function checkIfStepExists(self, stepNameArray, existingStepDefs){
        console.log("sdjkfhksf", stepNameArray)
        console.log("sdjkfhksf", existingStepDefs)
        console.log("self:", self)
        return new Promise(function (resolve, reject) {          
            _.each(stepNameArray, function(steps) {
                _.find(existingStepDefs, function (stepDefs) {                        
                    if (stepDefs.name === steps.name && stepDefs.type !== steps.type) {
                        console.log("rejected");
                        self.notifierService.error("Not Saving.StepName: "+ steps.name + " exists with: " + stepDefs.type);
                        reject(Error("Not Saving."));
                    } else {                        
                        resolve();
                    }
                });
            });
        });
     }
    
    // function getStepNamesStepDefs (self) {
    //     return new Promise(function (resolve, reject) {    
    //         var stepNames = extractSteps(self.fileModel.data);
    //         _.each (stepNames, function (stepName) {
    //               var stepNameStruct = {
    //                     name : stepName.substr(stepName.indexOf(" ") + 1),
    //                     type : _.first( stepName.split(" ") )
    //                 }
    //                self.stepNameArray.push(stepNameStruct);
    //             }),

    //           _.each(self.availableStepDefinitions, function(stepDefs){
    //                 var StepDefinitionStruct = {
    //                     name : stepDefs.name.substr(stepDefs.name.indexOf(" ") + 1),
    //                     type : _.first( stepDefs.name.split(" ") )
    //                 };
    //                 self.stepDefinitionsArray.push(StepDefinitionStruct);
    //             })

    //          resolve (self.stepNameArray);
    //          resolve(self.stepDefinitionsArray);
            
    //     }); 




    //}
    return FileEditorController;
})();

module.exports = FileEditorController;
