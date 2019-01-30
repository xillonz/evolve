// Reproduction Part

class Reproducer{   
    constructor(creature){
        this.creature = creature;
        this.breedingEnergy = 1001; // Required energy for breeding
        this.maturityAge = 500;
    }

    inherit(reproducer){
        this.breedingEnergy = mutate(reproducer.breedingEnergy);
        this.maturityAge = mutateAngle(reproducer.maturityAge);
    }

    reproduce(){   
        if(this.creature.energy >= this.breedingEnergy && this.creature.age >= this.maturityAge){
            new Creature(this.creature);
            this.creature.energy *= 0.7; // Energy left after reproducing
        }
    }


    // Test method only
    forceReproduce(){
        new Creature(this.creature);
        this.creature.energy *= 0.7; // Energy left after reproducing
    }
}
