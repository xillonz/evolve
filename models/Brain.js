// --- Brain/Neural Network constants ---
const neuronCount = 30;
const synapseCount = 3;
const brainMutationChance = 0.1;
const brainMutationFactor = 0.3;

var Brain = function(){
    this.senseRadius = 80;
    this.sL = 0;
    this.sR = 0;

    this.nCount = neuronCount; //neuron count
    this.sCount = synapseCount; // synapse count
    this.neurons = [];

    // Build neural network
    for(var i=0; i<this.nCount; i++){
        let synapses = [];
        for(var j=0; j<this.sCount; j++){
            //Generate random synapse links with random weights
            synapses.push({
                weight: randomFloat(-1.5, 1.5),
                link: randomInt(0, this.nCount - 1)
            }); 
        }

        this.neurons[i] = {
            activity: 0,
            synapses: synapses
        };
    }
}

Brain.prototype.fire = function(){
    // Assign input senses to first two nuerons in list (artificially chosen as "input" neurons)
    this.neurons.activity = this.sL;
    this.neurons.activity = this.sR;
    // Give some extra neurons some bias of 1 or 0 
    this.neurons.activity = 1;
    this.neurons.activity = 1;
    this.neurons.activity = 1;

    for(var i=6;i<this.neurons.length;i++){
        let neuron = this.neurons[i];        
        let a = 0; //Activation value
        // Check all the synapse links on this neuron
        for(var j=0;j<neuron.synapses.length;j++){
            let synapse = neuron.synapses[j];
            // add up all their weighted values (link weight with target neuron activity)
            if(this.neurons[synapse.link] === undefined) console.log(this);
            a += synapse.weight*this.neurons[synapse.link].activity;
        }
        // Sigmoid normalise and set as neuron activation value
        neuron.activity = 1.0/(1.0 + Math.exp(-a));
    }

    // Artificially treat the final neuron as the output, adjusting between -0.5 and 0.5 for turning left or right.
    return this.neurons[this.nCount-1].activity - 0.5;
}

Brain.prototype.mutate = function(brain){
    let mutation;
    for (var i=0;i<this.nCount;i++) {
        this.neurons[i] = {
            activity: 0,
            synapses: JSON.parse(JSON.stringify(brain.neurons[i].synapses))
        }
        for (var j=0;j<this.sCount;j++) {
            
            //Randomly adjust link weights
            if(Math.random() < brainMutationChance){
                mutation = randomFloat(0,brainMutationFactor*2) - brainMutationFactor;
                this.neurons[i].synapses[j].weight += mutation;
            }
            
            //Randomly adjust synapse links
            if(Math.random() < brainMutationChance){
                mutation = randomInt(0,this.nCount-1);
                this.neurons[i].synapses[j].link = mutation;
            }
            
        }
    }
}