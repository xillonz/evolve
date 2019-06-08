// --- Nutrient Constants ---
var latestNutrientId = 0;
const nutrientSpawnChance = 1; // Chance of spawning nutrient every tick
const minSize = 600;
const maxSize = 800;

// Nutrient constructor
class Nutrient{
    constructor(){
        this.x = randomInt(0, Environment.width);
        this.y = randomInt(0, Environment.height); 
        this.colour = 'darkseagreen';
        this.energy = randomInt(minSize, maxSize);   
    
        // Nutrient ID
        latestNutrientId += 1;
        this.id = latestNutrientId;
        
        Environment.nutrients[this.id] = this;
    }    

    size(){
        return this.energy/200;
    }
}  