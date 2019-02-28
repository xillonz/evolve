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

        this.open = false;

        this.inputs = {
            bite: new PartConnection()
        }
    }   

    inheritFeatures(mouth){
        this.radius = mutate(mouth.radius);
        // this.distance = mutate(mouth.distance);
        this.angle = mutateAngle(mouth.angle);
    }
    
    act(){
        // Bite
        if(this.inputs.bite.getBinary()){ // Close mouth
            if(this.open){              
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
    
                for(let id in Life.creatures){
                    if(id == this.creature.id) continue;
                    let creature = Life.creatures[id];
                    if(withinRadius(creature.x, creature.y, this.x, this.y, creature.radius)){
                        this.creature.energy += 50;   // Fixed energy stolen from other creatures, TODO: update when there is a more comprehensive system
                        creature.energy -= 50;            
                    }            
                }

                this.creature.energy -= 5; // Cost to biting
            }

            this.open = false;

            this.colour = {
                r: 50,
                g: 0,
                b: 0
            };            
        }else{ // Open mouth

            if(!this.open){
                this.creature.energy -= 5; // Cost to opening mouth
            }

            this.open = true;

            this.colour = {
                r: 180,
                g: 50,
                b: 50
            };
        }       
    }
}