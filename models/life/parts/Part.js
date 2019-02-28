// Constructor for attaching parts to brain neurons
class PartConnection {
    constructor(neuronId = null){
        this.neuronId = neuronId;
        this.value = 0;        
    }

    getBinary(){
        return !!Math.round(this.getSigmoid());
    }

    getSigmoid(){
        return  1.0/(1.0 + Math.exp(-this.value));
    }

    getBounded(){
        return 2*this.getSigmoid() - 1;
    }
}

class Part{
    static mutationChance() { return 0.2; } //Base mutation chance of creature parts
    static limit(){ return 10; } // Limit of number of parts of type on creature

    constructor(creature){
        
        this.creature = creature;
        this.locatable = true;  
        this.isSensor = false;
        this.inherited = false;

        this.colour = {
            r: 0,
            g: 0,
            b: 0
        };

        this.x = 0;
        this.y = 0;

        this.inputs = {};
        this.outputs = {};
    }

    inherit(part){
        for(var key in part.outputs){
            this.outputs[key] = new PartConnection(part.outputs[key].neuronId)
        }

        for(var key in part.inputs){
            this.inputs[key] = new PartConnection(part.inputs[key].neuronId)
        }
        
        this.inheritFeatures(part); // Inherit features specific to that part
        this.inherited = true;
    }

    inheritFeatures() {}

    // Act on brain output
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