class Mouth extends Part{
    constructor(){
        super();
        this.locatable = true;
        this.radius = 3;
        this.distance = 0.7; // Distance from center in units of creature size
        this.angle = 0; // Angle from front of creature
        this.x = 0;
        this.y = 0;

        this.colour = "#888";
    }    

    inherit(mouth){
        this.radius = mutate(mouth.radius)
    }

    // Bite
    act(creature){
        for(let id in foods){
            let food = foods[id];   
            if(withinRadius(food.x, food.y, this.x, this.y, this.radius)){
                creature.energy += food.energy;
                delete foods[food.id];
            
                // TODO: move to creature resource manager
                if(creature.energy >= creature.traits.breedingEnergy && creature.age >= creature.traits.maturityAge && Object.keys(creatures).length < maxCreatures){
                    creature.breed();
                }
            }
        }
    }
}
