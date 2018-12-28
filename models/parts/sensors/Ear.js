const earSensitivity= 0.0005; //how sensitive is the ear? decrease for more sensitivity...
const earMult= 0.5; //linear multiplier on strength of ear.

class Ear extends Sensor{
    static mutationChance() { return 0.1; }

    constructor(creature){
        super(creature); 

        this.hearingRadius = 80;       
        this.radius = 3;
        this.distance = randomFloat(0,1); // Distance from center in units of creature size
        this.angle = randomFloat(0, 2*Math.PI); // Angle from front of creature

        this.colour = {
            r: 150,
            g: 250,
            b: 100
        };
    }

    sense(){
        this.inputs = [];
        let input = 0;
        for(let id in foods){
            let food = foods[id];
            if(withinRadius(food.x, food.y, this.x, this.y, this.hearingRadius)){
                // pass sum of Sense data to creature's brain: M.e^(-S.d^2)
                input += earMult*Math.exp(-earSensitivity*(distance(this.x, this.y, food.x, food.y)));                
            }            
        }
         
        // Colour ears based on how much they sense
        let colour = Math.round(input*255.0); 
        if(colour>255) colour=255;
        this.colour = {
            r: colour,
            g: colour,
            b: colour
        };

        this.inputs.push(input);
    }

    inherit(ear){
        this.distance = mutate(ear.distance, 0, 1);
        this.angle = mutateAngle(ear.distance);
        this.hearingRadius = mutate(ear.hearingRadius, 0);
    }
}