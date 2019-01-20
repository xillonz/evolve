class Sensor extends Part{
    constructor(creature){
        super(creature);
        this.isSensor = true;
        this.outputs = {};
    }

    inherit(part){
        this.inputs = JSON.parse(JSON.stringify(part.inputs));
        this.outputs = JSON.parse(JSON.stringify(part.outputs));
        this.inheritFeatures(part); // Inherit features specific to that part
    }

    sense(){
        // Take stimuli from world - required function of all Sensor parts.
        this.receiveStimuli();

        for(var i in this.outputs){
            let output = this.outputs[i];

            // Pass to brain
            this.creature.brain.neurons[output.neuronId].activity = output.value;

            // Reset
            output.value = 0;
        }
    }

    receiveStimuli(){}
}