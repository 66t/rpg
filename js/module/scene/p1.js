function P1() { this.initialize(...arguments); }
P1.prototype = Object.create(Stage.prototype);
P1.prototype.constructor = P1;
P1.prototype.initialize = function() {
    Stage.call(this)
}
