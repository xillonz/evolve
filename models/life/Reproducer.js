// Reproduction Part

class Reproducer{   
    constructor(creature){
        this.creature = creature;
        this.breedingEnergy = 4001; // Required energy for breeding
        this.maturityAge = 700;
        this.cooldown = 0;
    }

    inherit(reproducer){
        this.breedingEnergy = mutate(reproducer.breedingEnergy);
        this.maturityAge = mutateAngle(reproducer.maturityAge);
    }

    reproduce(){   
        if(this.cooldown > 0){
            this.cooldown -= 1;
            return;
        }
        
        if(this.creature.energy >= this.breedingEnergy && this.creature.age >= this.maturityAge){
            new Creature(this.creature);
            this.creature.energy *= 0.7; // Energy left after reproducing
            this.cooldown = 100; // Cooldown period TODO: consider this being an inheritable property, bound by some rules
        }
    }


    // Test method only
    forceReproduce(){
        new Creature(this.creature);
        this.creature.energy *= 0.7; // Energy left after reproducing
    }
}
