// --- Toxin Constants ---
var latestToxinId = 0;
const toxinSpawnChance = 0.01; // Chance of spawning toxin every tick
const minToxicity = 1;
const maxToxicity = 4;

// Toxin constructor
class Toxin{
    constructor(){
        this.x = randomInt(0, canvas.width);
        this.y = randomInt(0, canvas.height); 
        this.colour = 'tomato';
        this.toxicity = randomFloat(minToxicity, maxToxicity);   
    
        // Toxin ID
        latestToxinId += 1;
        this.id = latestToxinId;
        
        Environment.toxins[this.id] = this;
    }  
}  