'use strict';

// Utilities:
var _ = require('lodash');

// Module:
var ComponentEditor = require('../ComponentEditor');

// Dependencies:
require('../../../Core/Services/ASTCreatorService');
require('../../../Core/Services/StringToLiteralService');

var createFilterModelConstructor = function (
    astCreatorService,
    stringToLiteralService
) {
    var ast = astCreatorService;

    var FilterModel = function FilterModel (element) {
        Object.defineProperties(this, {
            element: {
                get: function () {
                    return element;
                }
            },

            isGroup: {
                get: function () {
                    return this.type === 'options' || this.type === 'repeater';
                }
            },
            isText: {
                get: function () {
                    return this.type === 'text';
                }
            },

            ast: {
                get: function () {
                    return toAST.call(this);
                }
            }
        });

        this.type = _.first(this.types);
        this.locator = '';        
    };

    FilterModel.prototype.types = ['model', 'binding', 'text', 'css', 'options', 'repeater'];

    return FilterModel;

    function toAST () {
        if (this.isNested) {
            return toNestedAST.call(this);
        } else {
            return toSingleAST.call(this);
        }
    }

    function toNestedAST () {
        var locatorLiteral = ast.literal(this.locator);
        var template = '';

        var number = stringToLiteralService.toLiteral(locatorLiteral.value);
        if (_.isNumber(number)) {
            return ast.literal(number);
        } else {
            template += '(function (element) {';
            template += '    return element.getText().then(function (text) {';
            template += '        return text.indexOf(<%= locator %>) !== -1;';
            template += '    });';
            template += '});';
            return ast.expression(template, {
                locator: locatorLiteral
            });
        }
    }

    function toSingleAST () {               
        var template = '';

        if (!this.isText) {            
            var locatorLiteral = ast.literal(this.locator);            
            template += 'by.<%= type %>(<%= locator %>)';
            return ast.expression(template, {
                type: ast.identifier(this.type),
                locator: locatorLiteral
            });
        } else {                                   
            var locatorElement = this.locator.split(",");          
            var cssLiteral = ast.literal(locatorElement[0]);
            var stringLiteral = ast.literal(locatorElement[1]);                     
            template += 'by.cssContainingText(<%= locator %>,<%= searchString %>)';                   
            return ast.expression(template, {
                locator: cssLiteral,
                searchString: stringLiteral
            });
            
        }
    }
};

ComponentEditor.factory('FilterModel', function (
    astCreatorService,
    stringToLiteralService
) {
    return createFilterModelConstructor(astCreatorService, stringToLiteralService);
});
