const earSensitivity= 0.0005; //how sensitive is the ear? decrease for more sensitivity...
const earMult= 0.5; //linear multiplier on strength of ear.

class Ear extends Sensor{
    static mutationChance() { return 0.1; }
    static limit(){ return 2; }

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
        this.outputs = [];
        let nutrientInput = 0;
        for(let id in Environment.nutrients){
            let nutrient = Environment.nutrients[id];
            if(withinRadius(nutrient.x, nutrient.y, this.x, this.y, this.hearingRadius)){
                // pass sum of Sense data to creature's brain: M.e^(-S.d^2)
                nutrientInput += earMult*Math.exp(-earSensitivity*(distance(this.x, this.y, nutrient.x, nutrient.y)));                
            }            
        }

        this.outputs.push(nutrientInput);
        
        let toxinInput = 0;
        for(let id in Environment.toxins){
            let toxin = Environment.toxins[id];
            if(withinRadius(toxin.x, toxin.y, this.x, this.y, this.hearingRadius)){
                // pass sum of Sense data to creature's brain: M.e^(-S.d^2)
                toxinInput += earMult*Math.exp(-earSensitivity*(distance(this.x, this.y, toxin.x, toxin.y)));                
            }            
        }

        this.outputs.push(toxinInput);

        let creatureInput = 0;
        for(let id in Life.creatures){
            if(id == this.creature.id) continue;
            let creature = Life.creatures[id];
            if(withinRadius(creature.x, creature.y, this.x, this.y, this.hearingRadius)){
                // pass sum of Sense data to creature's brain: M.e^(-S.d^2)
                creatureInput += earMult*Math.exp(-earSensitivity*(distance(this.x, this.y, creature.x, creature.y)));                
            }            
        }

        this.outputs.push(creatureInput);

        // Colour ears based on how much they sense
        let nutrientColour = Math.round(nutrientInput*255.0); 
        if(nutrientColour>255) nutrientColour=255;
        let toxinColour = Math.round(toxinInput*255.0); 
        if(toxinColour>255) toxinColour=255;
        let creatureColour = Math.round(creatureInput*255.0); 
        if(creatureColour>255) creatureColour=255;

        this.colour = {
            r: toxinColour,
            g: nutrientColour,
            b: creatureColour
        };                 
    }

    inherit(ear){
        this.distance = mutate(ear.distance, 0, 1);
        this.angle = mutateAngle(ear.distance);
        this.hearingRadius = mutate(ear.hearingRadius, 0);
    }
}