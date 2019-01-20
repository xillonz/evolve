// Constructor for attaching parts to brain neurons
class PartConnection {
    constructor(){
        this.neuronId = null;
        this.value = 0;
    }
}

class Part{
    static mutationChance() { return 0.2; } //Base mutation chance of creature parts
    static limit(){ return 10; } // Limit of number of parts of type on creature

    constructor(creature){
        
        this.creature = creature;
        this.locatable = true;  
        this.isSensor = false;

        this.colour = {
            r: 0,
            g: 0,
            b: 0
        };

        this.x = 0;
        this.y = 0;

        this.inputs = {};
    }

    inherit(){}

    // Act on brain output TODO: update to
    behave(){
        for(var i in this.inputs){
            let input = this.inputs[i];

            // Collect from brain
            input.value = this.creature.brain.neurons[input.neuronId].activity;
        }

        this.act();
    }

    act() {}
}