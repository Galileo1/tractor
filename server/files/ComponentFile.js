'use strict';

// Dependencies:
import constants from '../constants';
const REQUIRE_QUERY = 'CallExpression[callee.name="require"] Literal';
//const VARIABLE_QUERY = 'AssignmentExpression[left.object.property.name="prototype"] Identifier';
const VARIABLE_QUERY = 'AssignmentExpression > .left[object.property.name="prototype"] .property[name!="prototype"]';
import fileStructure from '../file-structure';

// Utilities:
import _ from 'lodash';
import path from 'path';

// Dependencies: 
import esquery from 'esquery';
import JavaScriptFile from './JavaScriptFile';

export default class ComponentFile extends JavaScriptFile {
    delete () {
        return super.delete()
        .then(() => deleteFileReferences.call(this));
    }
    save (data) {
        if (data) {
            getVariableName(this);
            return super.save(data)
            //.then(() => getStepDefiFileReferences.call(this));        
        }
        
    }
}

function deleteFileReferences () {
    let { references } = this.directory.fileStructure;

    delete references[this.path];
}

function getStepDefiFileReferences () {    
     console.log("getStepDefiFileReferences");
    let { references } = this.directory.fileStructure;
    console.log(this.directory.fileStructure);

    _.each(references, (referencePaths) => {
        _.remove(referencePaths, (referencePath) => referencePath === this.path);
    });
    console.log("ast: ", this.ast);
    let requirePaths = esquery(this.ast, REQUIRE_QUERY);
     console.log("requirePaths: ", requirePaths)
    _.each(requirePaths, (requirePath) => {
        let directoryPath = path.dirname(this.path);
        let referencePath = path.resolve(directoryPath, requirePath.value);
        references[referencePath] = references[referencePath] || [];
        references[referencePath].push(this.path);
    });
   
}

 function getVariableName(self) {    
     let actionNames = esquery(self.ast, VARIABLE_QUERY); 
     console.log('req path:', actionNames);
     console.log('name:', self.name);
     console.log('path:', self.path);
     let { references } = self.directory.fileStructure;
     let existingFileNames = _(references)
     .filter(file => file.path.match(new RegExp(constants.EXTENSIONS['step-definitions'])))
     .map(file => file)
     .value();

    //  let existingFileNames = _(fileStructure.allFiles)
    // .filter(file => file.path.match(new RegExp(constants.EXTENSIONS['step-definitions'])))
    // .map(file => file.path)
    // .value();
     console.log(existingFileNames);
    //  _.each(actionNames, (actionName) {

    //  })

 }

