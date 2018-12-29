// --- Nutrient Constants ---
var latestNutrientId = 0;
const nutrientSpawnChance = 0.08; // Chance of spawning nutrient every tick
const minSize = 250;
const maxSize = 450;

// Nutrient constructor
class Nutrient{
    constructor(){
        this.x = randomInt(0, canvas.width);
        this.y = randomInt(0, canvas.height); 
        this.colour = 'darkseagreen';
        this.energy = randomInt(minSize, maxSize);   
    
        // Nutrient ID
        latestNutrientId += 1;
        this.id = latestNutrientId;
        
        Environment.nutrients[this.id] = this;
    }    

    size(){
        return this.energy/100;
    }
}  