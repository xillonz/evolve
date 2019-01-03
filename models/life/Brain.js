// --- Brain/Neural Network constants ---
const hiddenNeuronCount = 20;
const synapseCount = 10;
const brainMutationChance = 0.1;
const brainMutationFactor = 0.3;

class Brain{   
    constructor(creature){
        this.creature = creature;

        this.inputs = [];    
        this.outputs = [];
    
        this.hiddenNeuronCount = hiddenNeuronCount;
        this.synapseCount = synapseCount;      
        this.neurons = [];
    }

    buildDefault(){
         // Temporarily manually add speed and turn outputs to brain TODO: remove when there are movement parts
        this.outputs = [0, 0];

        // Check all parts and prep input and output count
        for(var i = 0; i < this.creature.parts.length; i++){
            let part = this.creature.parts[i];
            if(part.outputs){
                part.sense(); // Sense for the sake of collecting the right count of inputs
                for(var j = 0; j < part.outputs.length; j++){ 
                    this.inputs.push(0);
                }   
            }else if(part.inputs){
                for(var j = 0; j < part.inputs.length; j++){
                    this.outputs.push(0);
                }
            }                 
        }

        let inputCount = this.inputs.length;
        let outputCount = this.outputs.length;
        let totalNeurons = inputCount + this.hiddenNeuronCount + outputCount;

        let linkIndex;
        // Build default neural network
        for(var i=0; i<totalNeurons; i++){
            let synapses = [];
            for(var j=0; j<this.synapseCount; j++){
                //Generate random synapse links with random weights but dont link inputs to each other, or outputs to eachother
                if(i < inputCount){ // Input neuron
                    linkIndex = randomInt(inputCount, totalNeurons - 1)
                }else if(i > totalNeurons - outputCount - 1){ //Output neuron
                    linkIndex = randomInt(0, totalNeurons - outputCount - 1)
                }else{
                    linkIndex = randomInt(0, totalNeurons - 1)
                }
                // linkIndex = randomInt(0, totalNeurons - 1)
                synapses.push({
                    weight: randomFloat(-1.5, 1.5),
                    link: linkIndex
                }); 
            }
    
            this.neurons[i] = {
                activity: 0,
                synapses: synapses
            };
        }  
        
    }

    fire(){
        let inputCount = this.inputs.length;
        let outputCount = this.outputs.length;
        let totalNeurons = inputCount + this.hiddenNeuronCount + outputCount;

        // Assign input senses to firstnuerons in list (artificially chosen as "input" neurons)
        for(let i=inputCount+5;i<totalNeurons;i++){
            this.neurons[i].activity = 0;
        }

        for(let i = 0; i < this.inputs.length; i++){
            this.neurons[i].activity = this.inputs[i];
        }

        // Give some extra neurons some bias of 1 or 0 
        this.neurons[inputCount+1].activity = 1;
        this.neurons[inputCount+2].activity = 1;
        this.neurons[inputCount+3].activity = 1;
        this.neurons[inputCount+4].activity = 1;

        for(let i=inputCount+5;i<totalNeurons;i++){
            let neuron = this.neurons[i];           
            let a = 0; //Activation value
            // Check all the synapse links on this neuron
            for(let j=0;j<neuron.synapses.length;j++){
                let synapse = neuron.synapses[j];
                // add up all their weighted values (link weight with target neuron activity)
                a += synapse.weight*this.neurons[synapse.link].activity;
            }       

            // Sigmoid normalise and set as neuron activation value
            neuron.activity = (i < totalNeurons - outputCount - 1) ? 1.0/(1.0 + Math.exp(-a)) : a;   
        }

        // Artificially treat the final neurons as the output
        let outputs = this.neurons.slice(Math.max(totalNeurons - outputCount, 1));

        for(var i = 0; i < outputs.length; i++){        
            this.outputs[i] = outputs[i].activity - outputs[i].activity/2;     
        }
        
        return this.outputs;
    }

    inherit(brain){
        for (var i=0;i<totalNeurons;i++) {
            this.neurons[i] = {
                activity: 0,
                synapses: JSON.parse(JSON.stringify(brain.neurons[i].synapses))
            }
            for (var j=0;j<this.synapseCount;j++) {
                
                //Randomly adjust link weights
                if(Math.random() < brainMutationChance){
                    let weightChange = randomFloat(0,brainMutationFactor*2) - brainMutationFactor;
                    this.neurons[i].synapses[j].weight += weightChange;
                }
                
                //Randomly adjust synapse links
                if(Math.random() < brainMutationChance){
                    let linkIndex;
    
                    if(i < inputCount){ // Input neuron
                        linkIndex = randomInt(inputCount, totalNeurons - 1)
                    }else if(i > totalNeurons - outputCount - 1){ //Output neuron
                        linkIndex = randomInt(0, totalNeurons - outputCount - 1)
                    }else{
                        linkIndex = randomInt(0, totalNeurons - 1)
                    }
       
                    this.neurons[i].synapses[j].link = linkIndex;
                }
                
            }
        }
    }
}
