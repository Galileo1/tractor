/*global beforeEach:true, inject: true, describe:true, it:true, expect:true */
'use strict';

// Angular:
var angular = require('angular');
require('angular-mocks');

// Testing:
require('./TextInputDirective');

describe('TextInputDirective.js:', function() {
    var $compile;
    var $rootScope;

    beforeEach(angular.mock.module('Core'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    var compileDirective = function (template, scope) {
        var directive = $compile(template)(scope);
        scope.$digest();
        return directive;
    };

    describe('Link function:', function () {
        it('should throw an error when `model` is not passed in:', function () {
            expect(function () {
                var scope = $rootScope.$new();
                compileDirective('<tractor-text-input></tractor-literal-input>', scope);
            }).to.throw('The "tractor-text-input" directive requires a "model" attribute.');
        });

        it('should throw an error when `label` is not passed in:', function () {
            expect(function () {
                var scope = $rootScope.$new();
                scope.model = {};
                compileDirective('<tractor-text-input model="model"></tractor-literal-input>', scope);
            }).to.throw('The "tractor-text-input" directive requires a "label" attribute.');
        });

        it('should convert the "label" attribute into a camel-cased "property":', function () {
            var scope = $rootScope.$new();
            scope.model = {};
            scope.options = [];
            var directive = compileDirective('<tractor-text-input model="model" label="Some Label"></tractor-select>', scope);
            expect(directive.isolateScope().property).to.equal('someLabel');
        });
    });
});
