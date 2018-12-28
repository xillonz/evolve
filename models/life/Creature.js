// --- Creature constants ---
var latestCreatureId = 0;
var creatures = {};
const baseGenome = {
    speed: 1,
    turn: 0.02,
    energyBase: 1000    
};
const inheritable = ['speed', 'turn']; // inheritable traits that dont belong to a part
const energyDrainFactor = 0.001; // Factor by how much energy is drained per draw
const energyDrainConstant = 1; // Background energy drain (if the creature was sitting still)

const mutationChance = 0.2; // Chance of a mutation occurring upon breeding
const mutationFactor = 0.1; // How large a change can occur within the mutation

var mouthMutation = false;

// Mutation Helper
function mutate(val, min, max){

    let mutation = 1;
    if(Math.random() < mutationChance){
        let factor = randomFloat(0, mutationFactor);
        mutation = Math.random() < 0.5 ? 1 - factor : factor + 1; // 50/50 chance of reducing or increasing stats
    }

    val *= mutation;

    if(typeof min !== 'undefined' && val < min) val = min;
    if(typeof max !== 'undefined' && val > max) val = max;
   
    return val; 
}

function mutateAngle(val, min, max){
    if(typeof min === 'undefined') min = 0;
    if(typeof max === 'undefined') max = 360;

    let mutation = 1;
    if(Math.random() < mutationChance){
        let factor = randomFloat(0, mutationFactor);
        mutation = Math.random() < 0.5 ? 1 - factor : factor + 1; 
    }

    val *= mutation * (Math.PI / 180);

    if(val>2*Math.PI) val = val-2*Math.PI;
    if(val<0) val = 2*Math.PI+val;

    if(val < min) val = min;
    if(val > max) val = max;
   
    return val; 
}

// Creature constructor
class Creature{
    constructor(parent){
        //Base property values for creatures
        this.traits = baseGenome; 
        this.brain = new Brain(this);    
        this.reproducer = new Reproducer(this);    
        this.parts = [];
        

        // Starting position
        this.x = randomInt(0, canvas.width);
        this.y = randomInt(0, canvas.height);

        this.direction = randomVector(0, 360, this.traits.speed);

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
        if(parent != 'undefined' && parent instanceof Creature) this.genesis(parent);

        this.checkAbnormalities(0);
    }   
    
    genesis(parent){
        // Inherit traits
        let traits = parent.traits;
        let mutatedTraits = JSON.parse(JSON.stringify(traits));

        for(var i = 0; i < inheritable.length; i++){
            if(Math.random() < mutationChance){
                let mutation = Math.random() < 0.5 ? -1 * mutationFactor + 1 : mutationFactor + 1;
                mutatedTraits[inheritable[i]] *= mutation;
            }

            mutatedTraits[inheritable[i]] = mutate(mutatedTraits[inheritable[i]]);
        }    

        this.traits = mutatedTraits;

        // Inherit the parents brain
        this.brain.inherit(parent.brain);

        // Inherit parts
        for(var i=0; i<parent.parts.length;i++){
            let newPart = new parent.parts[i].constructor(this);
            this.parts.push(newPart);
            newPart.inherit(parent.parts[i])
        }    

        // Update child stats
        this.parentId = parent.id; 
        this.generation = parent.generation + 1;
        this.x = parent.x+parent.radius*2;
        this.y = parent.y+parent.radius*2;
    }

    checkAbnormalities(abnormalityBonus){        
        // Randomly aquire new parts
        for(var i in partClasses){
            if(countClass(this.parts, partClasses[i]) >= partClasses[i].limit()) continue;
            if(Math.random() < partClasses[i].mutationChance() + abnormalityBonus){
                var newPart = new partClasses[i](this);
                this.parts.push(newPart);
            }
        }    
    }

    move(turn, speed){
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

        // Teleport to otherside of map
        if(this.x<0) this.x = canvas.width;
        if(this.x>canvas.width) this.x= 0;
        if(this.y<0) this.y= canvas.height;
        if(this.y>canvas.height) this.y= 0;

        this.energy -= energyDrainFactor*this.radius*this.direction.m*this.direction.m + energyDrainConstant; // Reduce creatures energy: D.m.v²+C
    }

    grow(){
        this.age += 1
        let scaleFactor = (this.age >= this.reproducer.maturityAge) ? 1 : this.age/this.reproducer.maturityAge; 
        if(scaleFactor < 0.5) scaleFactor = 0.5;
        this.radius = this.baseSize*scaleFactor;
    }

    die(){
        delete creatures[this.id];
    }
} 