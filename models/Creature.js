// --- Creature constants ---
var latestCreatureId = 0;
var creatures = {};
const baseGenome = {
    speed: 2,
    energyBase: 1000,
    breedingEnergy: 1300,
    maturityAge: 500
};
const inheritable = []; // 'speed','breedingEnergy', 'maturityAge'
const energyDrainFactor = 0.12; // Factor by how much energy is drained per draw
const energyDrainConstant = 1; // Background energy drain (if the creature was sitting still)
const mutationChance = 0.3; // Chance of a mutation occurring upon breeding
const mutationFactor = 0.2; // How large a change can occur within the mutation

const maxCreatures = 18;

// Creature constructor
var Creature = function(traits){            
    //Base property values for creatures
    this.traits = this.inherit(traits);
    this.brain = new Brain();
    
    // Starting position
    this.x = randomInt(0, canvas.width);
    this.y = randomInt(0, canvas.height);;

    this.direction = randomVector();
    
    this.energy = this.traits.energyBase;
    this.age = 0;
    this.scaleFactor = 0.5;
    
    // Get creature image
    this.img = new Image();
    this.img.src = './assets/images/creature.png';

    this.orginalSize = 17;
    this.radius = this.orginalSize;

    // Family Info
    this.parentId = null;
    this.generation = 1;
    this.selected = false;

    // Creature ID
    latestCreatureId += 1;
    this.id = latestCreatureId;
    
    creatures[this.id] = this;
}

// Inherit non intelligent traits
Creature.prototype.inherit = function(traits) {  
    let mutatedTraits = JSON.parse(JSON.stringify(traits));

    for(var i = 0; i < inheritable.length; i++){
        if(Math.random() < mutationChance){
            let mutation = Math.random() < 0.5 ? -1 * mutationFactor + 1 : mutationFactor + 1;
            console.log(`A ${inheritable[i]} mutation occurred with a factor of: `, mutation);
            mutatedTraits[inheritable[i]] *= mutation;
        }
    }    

    return mutatedTraits;
}  

Creature.prototype.breed = function() {  
    let child = new Creature(this.traits);
    child.parentId = this.id; 
    child.generation = this.generation + 1;
    child.x = this.x;
    child.y = this.y;

    // Copy brain mapping with chance of mutations
    child.brain.mutate(this.brain);

    this.energy *= 0.7; // Energy left after breeding

    // child.energy = this.energy;
}   

Creature.prototype.move = function() {
        let minAngle = null;
        // if(this.x + this.img.width > canvas.width) minAngle = 90; // hit right side
        // if(this.x < 0) minAngle = 270; // hit left side
        // if(this.y + this.img.height > canvas.height) minAngle = 180; // hit bottom
        // if(this.y < 0) minAngle = 360;  // hit top

        if(this.x + this.radius > canvas.width) minAngle = 90; // hit right side
        if(this.x - this.radius < 0) minAngle = 270; // hit left side
        if(this.y + this.radius > canvas.height) minAngle = 180; // hit bottom
        if(this.y - this.radius < 0) minAngle = 360;  // hit top

        if(minAngle !== null){               
            this.direction = randomVector(minAngle, minAngle + 180);
        }
        
        this.x += this.direction.x * this.traits.speed;    
        this.y += this.direction.y * this.traits.speed; 

        this.energy -= energyDrainFactor*this.traits.speed*this.traits.speed + energyDrainConstant; // Reduce creatures energy: D.s²+C
} 

Creature.prototype.die = function() {
    delete creatures[this.id];
} 

Creature.prototype.eat = function(food) {
    this.energy += food.energy;
    delete foods[food.id];

    if(this.energy >= this.traits.breedingEnergy && this.age >= this.traits.maturityAge && Object.keys(creatures).length < maxCreatures){
        this.breed();
    }
} 

Creature.prototype.grow = function() {
    this.age += 1
    let scaleFactor = (this.age >= this.traits.maturityAge) ? 1 : this.age/this.traits.maturityAge; 
    if(scaleFactor < 0.5) scaleFactor = 0.5;
    this.radius = this.orginalSize*scaleFactor;
}   