class Mouth extends Part{
    static mutationChance() { return 0.2; }

    constructor(creature){
        super(creature);
        this.locatable = true;
        this.radius = 4;
        this.distance = 0.8; // Distance from center in units of creature size
        this.angle = randomFloat(0, 2*Math.PI); // Angle from front of creature
        this.x = 0;
        this.y = 0;

        this.colour = {
            r: 200,
            g: 50,
            b: 50
        };
    }   

    inherit(mouth){
        mouthMutation = true;
        this.radius = mutate(mouth.radius);
        // this.distance = mutate(mouth.distance);
        this.angle = mutateAngle(mouth.angle);

        mouthMutation = false;
    }

    // Bite
    act(){
        for(let id in nutrients){
            let nutrient = nutrients[id];   
            if(nutrient.size() <= this.radius && withinRadius(nutrient.x, nutrient.y, this.x, this.y, this.radius)){
                this.creature.energy += nutrient.energy;
                delete nutrients[nutrient.id];
            }
        }

        for(let id in toxins){
            let toxin = toxins[id];   
            if(toxin.toxicity <= this.radius && withinRadius(toxin.x, toxin.y, this.x, this.y, this.radius)){
                this.creature.energy -= toxin.toxicity/0.3; // Reduce energy by toxicity reduces by some creature resistance factor (to be updated)
                delete toxins[toxin.id];
            }
        }
    }
}