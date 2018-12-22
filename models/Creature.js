// Creature constructor
var Creature = function(traits){            
    //Base property values for creatures
    this.traits = this.inherit(traits);
    
    // Starting position
    this.x = 300;
    this.y = 150;

    let vector = randomVector();
    this.xDir = vector.x;
    this.yDir = vector.y;
    
    this.energy = this.traits.energyBase;
    this.age = 0;
    this.scaleFactor = 0.5;
    
    // Get creature image
    this.img = new Image();
    this.img.src = './assets/images/creature.png';

    // Family Info
    this.parentId = null;
    this.generation = 1;
    this.selected = false;

    // Creature ID
    latestCreatureId += 1;
    this.id = latestCreatureId;
    
    creatures[this.id] = this;
}

Creature.prototype.inherit = function(traits) {  
    let mutatedTraits = JSON.parse(JSON.stringify(traits));

    for(var i = 0; i < inheritable.length; i++){
        if(Math.random() < mutationChance){
            let factor = Math.random() < 0.5 ? -1 * mutationFactor + 1 : mutationFactor + 1;
            console.log(`A ${inheritable[i]} mutation occurred with a factor of: `, factor);
            mutatedTraits[inheritable[i]] *= factor;
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

    this.energy = this.energy/2;

    child.energy = this.energy;
}   

Creature.prototype.move = function() {
        let minAngle = null;
        if(this.x + this.img.width > canvas.width) minAngle = 90; // hit right side
        if(this.x < 0) minAngle = 270; // hit left side
        if(this.y + this.img.height > canvas.height) minAngle = 180; // hit bottom
        if(this.y < 0) minAngle = 360;  // hit top
        if(minAngle !== null){               
            let vector = randomVector(minAngle, minAngle + 180);
            this.xDir = vector.x;
            this.yDir = vector.y;
        }
        
        this.x += this.xDir * this.traits.speed;    
        this.y += this.yDir * this.traits.speed; 

        this.energy -= energyDrainFactor*this.traits.speed*this.traits.speed + energyDrainConstant; // Reduce creatures energy: D.s²+C
} 

Creature.prototype.die = function() {
    delete creatures[this.id];
} 

Creature.prototype.eat = function(food) {
    this.energy += food.energy;
    delete foods[food.id];

    if(this.energy >= this.traits.breedingEnergy && this.age >= this.traits.maturityAge){
        this.breed();
    }
} 

Creature.prototype.grow = function() {
    this.age += 1
    this.scaleFactor = (this.age >= this.traits.maturityAge) ? 1 : this.age/this.traits.maturityAge;
    if(this.scaleFactor < 0.5) this.scaleFactor = 0.5;
}   