// --- Toxin Constants ---
var latestToxinId = 0;
var toxins = {};
const toxinSpawnChance = 0.002; // Chance of spawning toxin every tick
const minToxicity = 1;
const maxToxicity = 4;

// Toxin constructor
class Toxin{
    constructor(){
        this.x = randomInt(0, canvas.width);
        this.y = randomInt(0, canvas.height); 
        this.colour = 'lime';
        this.toxicity = randomFloat(minToxicity, maxToxicity);   
    
        // Toxin ID
        latestToxinId += 1;
        this.id = latestToxinId;
        
        toxins[this.id] = this;
    }  
}  