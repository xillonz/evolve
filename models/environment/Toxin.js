// --- Toxin Constants ---
var latestToxinId = 0;
const toxinSpawnChance = 0.00001; // Chance of spawning toxin every tick
const minToxicity = 1;
const maxToxicity = 4;

// Toxin constructor
class Toxin{
    constructor(){
        this.x = randomInt(0, Environment.width);
        this.y = randomInt(0, Environment.height); 
        this.colour = 'tomato';
        this.toxicity = randomFloat(minToxicity, maxToxicity);   
    
        // Toxin ID
        latestToxinId += 1;
        this.id = latestToxinId;
        
        Environment.toxins[this.id] = this;
    }  
}  