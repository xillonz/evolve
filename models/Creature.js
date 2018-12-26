// --- Creature constants ---
var latestCreatureId = 0;
var creatures = {};
const baseGenome = {
    speed: 2,
    turn: 0.06,
    energyBase: 1000,
    breedingEnergy: 1300,
    maturityAge: 500
};
const inheritable = ['speed', 'turn']; // 'speed','breedingEnergy', 'maturityAge'
const energyDrainFactor = 0.001; // Factor by how much energy is drained per draw
const energyDrainConstant = 1; // Background energy drain (if the creature was sitting still)
const mutationChance = 0.3; // Chance of a mutation occurring upon breeding
const mutationFactor = 0.2; // How large a change can occur within the mutation

const maxCreatures = 18;

// Creature constructor
var Creature = function(parent){            
    //Base property values for creatures
    this.traits = baseGenome; 
    this.parts = {
        brain: new Brain(),
        mouth: new Mouth()
    };
    
    // Starting position
    this.x = randomInt(0, canvas.width);
    this.y = randomInt(0, canvas.height);

    this.direction = randomVector(0, 2*Math.PI, this.traits.speed);
    
    this.energy = this.traits.energyBase;
    this.age = 0;
    this.scaleFactor = 0.5;
    
    // Get creature image
    // this.img = new Image();
    // this.img.src = './assets/images/creature.png';

    this.baseSize = 17;
    this.radius = this.baseSize;

    // Family Info
    this.parentId = null;
    this.generation = 1;
    this.selected = false;

    // Creature ID
    latestCreatureId += 1;
    this.id = latestCreatureId;
    
    creatures[this.id] = this;
    // Update the stats to that of the parent with mutations
    if(parent != 'undefined' && parent instanceof Creature) this.inherit(parent);
}

// Inherit parents traits and parts
Creature.prototype.inherit = function(parent) {  
    // Inherit traits
    let traits = parent.traits;
    let mutatedTraits = JSON.parse(JSON.stringify(traits));

    for(var i = 0; i < inheritable.length; i++){
        if(Math.random() < mutationChance){
            let mutation = Math.random() < 0.5 ? -1 * mutationFactor + 1 : mutationFactor + 1;
            mutatedTraits[inheritable[i]] *= mutation;
        }
    }    

    this.traits = mutatedTraits;


    // Inherit parts
    for(var i in parent.parts){
        let className = parent.parts[i].constructor.name;
        let newPart = new window[className];
        this.parts[className.toLowerCase()] = newPart;
        newPart.inherit(parent.parts[i])
    }


    // Update child stats
    this.parentId = parent.id; 
    this.generation = parent.generation + 1;
    this.x = parent.x+parent.radius*2;
    this.y = parent.y+parent.radius*2;
}  

Creature.prototype.breed = function() {  
    new Creature(this);
    this.energy *= 0.7; // Energy left after breeding
}   

Creature.prototype.move = function(turn, speed) {
        // BOUNCE OFF WALL
        // let minAngle = null;
        // if(this.x + this.img.width > canvas.width) minAngle = 90; // hit right side
        // if(this.x < 0) minAngle = 270; // hit left side
        // if(this.y + this.img.height > canvas.height) minAngle = 180; // hit bottom
        // if(this.y < 0) minAngle = 360;  // hit top

        // if(this.x + this.radius > canvas.width) minAngle = 90; // hit right side
        // if(this.x - this.radius < 0) minAngle = 270; // hit left side
        // if(this.y + this.radius > canvas.height) minAngle = 180; // hit bottom
        // if(this.y - this.radius < 0) minAngle = 360;  // hit top

        // if(minAngle !== null){               
        //     this.direction = randomVector(minAngle, minAngle + 180, this.direction.m);
        // }

        if(typeof turn != 'undefined'){           
            this.direction = vector(this.direction.a+turn, speed);
        }
        
        this.x += this.direction.x;    
        this.y += this.direction.y; 

        if(this.x<0) this.x = canvas.width;
        if(this.x>canvas.width) this.x= 0;
        if(this.y<0) this.y= canvas.height;
        if(this.y>canvas.height) this.y= 0;

        this.energy -= energyDrainFactor*this.radius*this.direction.m*this.direction.m + energyDrainConstant; // Reduce creatures energy: D.m.v²+C
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
    this.radius = this.baseSize*scaleFactor;
}   

//Update the part locations relative to the creature
Creature.prototype.locateParts = function(){
    for(var i in this.parts){
        let part = this.parts[i];
        part.x = this.x + this.radius*part.distance*Math.cos(this.direction.a - part.angle);
        part.y = this.y + this.radius*part.distance*Math.sin(this.direction.a - part.angle);
    }
}