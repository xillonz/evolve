class Absorber extends Part{
    static mutationChance() { return 0.5; }
    static limit(){ return 1; } // Limit of number of parts of type on creature

    constructor(creature){
        super(creature);
        this.locatable = false;
        this.absorptionRadius = 1;
        this.absorptionRate = 1.3; // energy / tick
    }   

    inherit(absorber){
        // this.absorbtionRadius = mutate(absorber.absorbtionRadius)
    }

    // Absorb
    act(){
        for(let id in Environment.nutrients){
            let nutrient = Environment.nutrients[id];   
            if(withinRadius(nutrient.x, nutrient.y, this.creature.x, this.creature.y, this.creature.radius*this.absorptionRadius)){
                this.creature.energy += this.absorptionRate;
                nutrient.energy -= this.absorptionRate;           
            }
        }
    }
}