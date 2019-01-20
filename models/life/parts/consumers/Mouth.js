class Mouth extends Part{
    static mutationChance() { return 1; }
    static limit(){ return 1; }

    constructor(creature){
        super(creature);

        this.radius = 4;
        this.distance = 1.2; // Distance from center in units of creature size
        this.angle = randomFloat(0, 2*Math.PI); // Angle from front of creature
        this.x = 0;
        this.y = 0;

        this.colour = {
            r: 180,
            g: 50,
            b: 50
        };
    }   

    inheritFeatures(mouth){
        this.radius = mutate(mouth.radius);
        // this.distance = mutate(mouth.distance);
        this.angle = mutateAngle(mouth.angle);
    }

    // Bite
    act(){
        for(let id in Environment.nutrients){
            let nutrient = Environment.nutrients[id];   
            if(nutrient.size() <= this.radius && withinRadius(nutrient.x, nutrient.y, this.x, this.y, this.radius)){
                this.creature.energy += nutrient.energy;
                delete Environment.nutrients[nutrient.id];
            }
        }

        for(let id in Environment.toxins){
            let toxin = Environment.toxins[id];   
            if(toxin.toxicity <= this.radius && withinRadius(toxin.x, toxin.y, this.x, this.y, this.radius)){
                this.creature.energy -= toxin.toxicity/0.02; // Reduce energy by toxicity reduces by some creature resistance factor (to be updated)
                delete Environment.toxins[toxin.id];
            }
        }
    }
}