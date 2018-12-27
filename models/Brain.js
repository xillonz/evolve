// --- Brain/Neural Network constants ---
const hiddenNeuronCount = 20;
const synapseCount = 10;
const brainMutationChance = 0.1;
const brainMutationFactor = 0.3;

class Brain{   
    constructor(){
        this.inputs = []
    
        this.outputs = {
            turn: 0,
            speed: 0
        }
    
        this.hiddenNeuronCount = hiddenNeuronCount;
        this.synapseCount = synapseCount;
        this.inputCount = this.inputs.length;
        this.outputCount = Object.keys(this.outputs).length;
        this.totalNeurons = this.inputCount + this.hiddenNeuronCount + this.outputCount;
        this.neurons = [];
    
        
        let linkIndex;
        // Build default neural network
        for(var i=0; i<this.totalNeurons; i++){
            let synapses = [];
            for(var j=0; j<this.synapseCount; j++){
                //Generate random synapse links with random weights but dont link inputs to each other, or outputs to eachother
                if(i < this.inputCount){ // Input neuron
                    linkIndex = randomInt(this.inputCount, this.totalNeurons - 1)
                }else if(i > this.totalNeurons - this.outputCount - 1){ //Output neuron
                    linkIndex = randomInt(0, this.totalNeurons - this.outputCount - 1)
                }else{
                    linkIndex = randomInt(0, this.totalNeurons - 1)
                }
                // linkIndex = randomInt(0, this.totalNeurons - 1)
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
        // Assign input senses to first two nuerons in list (artificially chosen as "input" neurons)
        for(let i=this.inputCount+5;i<this.totalNeurons;i++){
            this.neurons[i].activity = 0;
        }

        for(let i = 0; i < this.inputs.length; i++){
            this.neurons[i].activity = this.inputs[i];
        }
        // Give some extra neurons some bias of 1 or 0 
        this.neurons[this.inputCount+1].activity = 1;
        this.neurons[this.inputCount+2].activity = 1;
        this.neurons[this.inputCount+3].activity = 1;
        this.neurons[this.inputCount+4].activity = 1;

        for(let i=this.inputCount+5;i<this.totalNeurons;i++){
            let neuron = this.neurons[i];           
            let a = 0; //Activation value
            // Check all the synapse links on this neuron
            for(let j=0;j<neuron.synapses.length;j++){
                let synapse = neuron.synapses[j];
                // add up all their weighted values (link weight with target neuron activity)
                if(this.neurons[synapse.link] === undefined) console.log(this, synapse)
                a += synapse.weight*this.neurons[synapse.link].activity;
            }       

            // Sigmoid normalise and set as neuron activation value
            neuron.activity = (i < this.totalNeurons - this.outputCount - 1) ? 1.0/(1.0 + Math.exp(-a)) : a;   
        }

        // Artificially treat the final neurons as the output
        let outputs = this.neurons.slice(Math.max(this.totalNeurons - this.outputCount, 1));
        let i = 0;
        for(var action in this.outputs){        
            this.outputs[action] = outputs[i].activity - outputs[i].activity/2;
            i++;
        }
        return this.outputs;
    }

    inherit(brain){
        for (var i=0;i<this.totalNeurons;i++) {
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
    
                    if(i < this.inputCount){
                        linkIndex = randomInt(this.inputCount - 1, this.totalNeurons - 1)
                    }else if(i > this.totalNeurons - this.outputCount - 1){
                        linkIndex = randomInt(this.inputCount - 1, this.totalNeurons - 1)
                    }else{
                        linkIndex = randomInt(0, this.totalNeurons - 1)
                    }
    
                    // linkIndex = randomInt(0, this.totalNeurons - 1)
       
                    this.neurons[i].synapses[j].link = linkIndex;
                }
                
            }
        }
    }
}
