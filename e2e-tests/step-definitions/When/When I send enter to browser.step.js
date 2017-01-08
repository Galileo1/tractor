/*{"name":"When I open Tractor","components":[{"name":"Tractor"}],"mockData":[]}*/
module.exports = function () {
    var SendEnterAction = require('../../components/send enter action.component.js'), tractor = new SendEnterAction();
    this.When(/^I send enter to browser$/, function (done) {
        var tasks = tractor.sendEnterToBrowser();
        Promise.resolve(tasks).then(done).catch(done.fail);
    });
};