/*{"name":"send enter action","elements":[],"actions":[{"name":"send enter to browser","parameters":[]}]}*/
module.exports = function () {
    var SendEnterAction = function SendEnterAction() {
    };
    SendEnterAction.prototype.sendEnterToBrowser = function () {
        var self = this;
        return new Promise(function (resolve) {
            resolve(browser.actions().sendKeys(protractor.Key.ENTER).perform());
        });
    };
    return SendEnterAction;
}();