// --- Food Constants ---
var latestFoodId = 0;
var foods = {};
const foodSpawnChance = 0.09; // Chance of spawning food every draw

// Food constructor
var Food = function(){
    this.x = randomInt(0, canvas.width);
    this.y = randomInt(0, canvas.height); 
    this.colour = 'tomato';
    this.energy = randomInt(250, 350);
    this.size = this.energy/70;

    // Food ID
    latestFoodId += 1;
    this.id = latestFoodId;
    
    foods[this.id] = this;
}  