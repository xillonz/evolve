const earSensitivity= 0.0005; //how sensitive is the ear? decrease for more sensitivity...
const earMult= 0.5; //linear multiplier on strength of ear.

class Ear extends Sensor{
    constructor(){
        super();

        this.hearingRadius = 30;
        this.colour = "#77f";
        this.radius = 4;
        this.distance = 1; // Distance from center in units of creature size
        this.angle = 0.6; // Angle from front of creature
    }

    sense(){
        this.inputs = [];
        let input = 0;
        for(let id in foods){
            let food = foods[id];
            if(withinRadius(food.x, food.y, this.x, this.y, this.hearingRadius)){
                // pass sum of Sense data to creature's brain: M.e^(-S.d^2)
                input += earMult*Math.exp(-earSensitivity*(Math.pow(this.x-food.x,2) + Math.pow(this.y-food.y,2)));                
            }            
        }

        this.inputs.push(input);
    }

    inherit(ear){
        this.hearingRadius = mutate(ear.hearingRadius);
    }
}