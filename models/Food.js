// --- Food Constants ---
var latestFoodId = 0;
var foods = {};
const foodSpawnChance = 0.08; // Chance of spawning food every draw
const minSize = 300;
const maxSize = 500;

// Food constructor
var Food = function(){
    this.x = randomInt(0, canvas.width);
    this.y = randomInt(0, canvas.height); 
    this.colour = 'darkseagreen';
    this.energy = randomInt(minSize, maxSize);   

    // Food ID
    latestFoodId += 1;
    this.id = latestFoodId;
    
    foods[this.id] = this;

    this.size = function(){
        return this.energy/100;
    }
}  