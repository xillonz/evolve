// --- Brain/Neural Network constants ---
const hiddenNeuronCount = 20;
const synapseCount = 10;
const brainMutationChance = 0.1;
const brainMutationFactor = 0.3;

const NEURON_TYPES = {
    HIDDEN: 'H',
    BIAS: 'B',
    INPUT: 'I',
    OUTPUT: 'O'
}

class Neuron{
    constructor(type){
        this.id = '_' + Math.random().toString(36).substr(2, 9);
        this.type = type;
        this.activity = 0;
        this.synapses = []
    }
}

class Brain{   
    constructor(creature){
        this.creature = creature;
        this.latestNeuronId = 0;
    
        this.hiddenNeuronCount = hiddenNeuronCount;
        this.synapseCount = synapseCount;      
        this.neurons = {};

        // Store changes compared to previous parent during inheritance in order to rewire the brain appropriately
        this.newParts = []; 
        this.removedParts = [];

        this.viableConnectionArray = []; // List of neuron ids that can pass be viable targets for synapse links
    }

    fire(){     

        for(var id in this.neurons){
            let neuron = this.neurons[id];
            let a = 0; //Activation value

            for(let j=0;j<neuron.synapses.length;j++){
                let synapse = neuron.synapses[j];
                // add up all their weighted values (link weight with target neuron activity)
                a += synapse.weight*this.neurons[synapse.link].activity;
            }  
            
            if(neuron.type === NEURON_TYPES.OUTPUT){
                neuron.activity = a - a/2; // Allow negative activity for output neurons
            }else{
                neuron.activity = 1.0/(1.0 + Math.exp(-a)); // Sigmoid normalise and set as neuron activation value
            }
        }
    }

    buildDefault(){         
        // Temporarily manually add speed and turn outputs to brain TODO: remove when there are movement parts       
        this.creature.turnConnector.neuronId = this.createNeurons(NEURON_TYPES.OUTPUT);
        this.creature.speedConnector.neuronId = this.createNeurons(NEURON_TYPES.OUTPUT);


        // Check all parts and prep input and output neurons
        for(var i = 0; i < this.creature.parts.length; i++){
            let part = this.creature.parts[i];
            if(part.outputs){
                for(var j in part.outputs){
                    part.outputs[j].neuronId = this.createNeurons(NEURON_TYPES.INPUT);
                }   
            }else if(part.inputs){
                for(var j in part.inputs)  {
                    part.inputs[j].neuronId = this.createNeurons(NEURON_TYPES.OUTPUT);
                }                          
            }                 
        }

        // Create bias neurons
        this.createNeurons(NEURON_TYPES.BIAS, 5);  

        // Create hidden neurons
        this.createNeurons(NEURON_TYPES.HIDDEN, this.hiddenNeuronCount);  

        // Create connections for different types of neurons  
        for(var id in this.neurons){
            let neuron = this.neurons[id];
            switch(neuron.type){
                case NEURON_TYPES.INPUT:
                    neuron.synapses = [] // Inputs get their activity value from sense parts, not from synaptic links
                    break;
                case NEURON_TYPES.BIAS:
                    neuron.synapses = [] // Biases have static activity, no need to have receptive links (though other neurons could link from them)
                    break;
                case NEURON_TYPES.HIDDEN:
                    neuron.synapses = this.createSynapses();
                    break;
                case NEURON_TYPES.OUTPUT:
                    neuron.synapses = this.createSynapses();
                    break;
            }
        }        
    }

    inherit(brain){

        this.neurons = JSON.parse(JSON.stringify(brain.neurons))
        this.viableConnectionArray = brain.viableConnectionArray;

        // Create neurons and links for new inputs/outputs 
        for(var i = 0; i < this.newParts; i++){
            let part = this.newParts[i];
            if(part.outputs){
                for(var j in part.outputs){
                    part.outputs[j].neuronId = this.createNeurons(NEURON_TYPES.INPUT);
                }   
            }else if(part.inputs){
                for(var j in part.inputs)  {
                    part.inputs[j].neuronId = this.createNeurons(NEURON_TYPES.OUTPUT);
                }                          
            } 
        }

        this.newParts = null; // Remove link to new parts - unneeded

        // Generate new syapses for new parts or mutate old parts
        for(var id in this.neurons){
            let neuron = this.neurons[id];
            neuron.activity = 0; //Reset activity - dont want to inherit parent's current action
          
            if(neuron.type === NEURON_TYPES.HIDDEN || neuron.type === NEURON_TYPES.OUTPUT){
                if(!neuron.synapses.length){ // New neuron from newly generated parts
                    neuron.synapses = this.createSynapses();
                }else{
                    // Mutation possibility for old neurons
                    for (var j=0;j<neuron.synapses.length;j++) {
                        //Randomly adjust link weights
                        if(Math.random() < brainMutationChance){
                            let weightChange = randomFloat(0,brainMutationFactor*2) - brainMutationFactor;
                            neuron.synapses[j].weight += weightChange;
                        }

                        //Randomly adjust synapse links TODO: if a link has a null target, give it a new one (or maybe ignore it)
                        if(Math.random() < brainMutationChance){                        
                            neuron.synapses[j].link = this.randomSynapse()                           
                        }
                    }
                }
            }
        }
    }

    createNeurons(type, quantity = 1){ 
        for(var i = 0; i < quantity; i++){
            let _N = new Neuron(type);            
            this.neurons[_N.id] = _N;  

            switch(type){
                case NEURON_TYPES.INPUT:
                    this.viableConnectionArray.push(_N.id);
                    break;
                case NEURON_TYPES.BIAS:
                    _N.activity = Math.round(Math.random()); //Random static activity of 1 or 0;
                    this.viableConnectionArray.push(_N.id); 
                    break;
                case NEURON_TYPES.HIDDEN:
                    this.viableConnectionArray.push(_N.id);
                    break;
                case NEURON_TYPES.OUTPUT:
                    break;
            }

            if(quantity === 1) return _N.id;
        }
    }

    createSynapses(quantity = this.synapseCount){
        let synapses = [];

        for(let i = 0; i < quantity; i++){
            synapses.push({
                weight: randomFloat(-1.5, 1.5),
                link: this.randomSynapse()
            });
        }        

        return synapses;
    }

    randomSynapse(){
        let nArray = this.viableConnectionArray;
        return nArray[Math.floor(Math.random()*nArray.length)]
    }
}
