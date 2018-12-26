var Mouth = function(){
    this.locatable = true;
    this.radius = 5;
    this.distance = 0.7; // Distance from center in units of creature size
    this.angle = 0; // Angle from front of creature
    this.x = 0;
    this.y = 0;
}

Mouth.prototype.inherit = function(mouth){

    this.radius = mouth.radius;

}

Mouth.prototype.eat = function(){

}