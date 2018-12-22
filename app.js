var canvas = document.getElementById('world');
canvas.width  = 900;
canvas.height = 600;
var ctx = canvas.getContext('2d');  
var animation;
var paused = true;


var latestCreatureId = 0;
var creatures = {};
const baseGenome = {
    speed: 2,
    energyBase: 1000,
    breedingEnergy: 1300,
    maturityAge: 500
};
const inheritable = ['speed','breedingEnergy', 'maturityAge'];
const energyDrainFactor = 0.15; // Factor by how much energy is drained per draw
const energyDrainConstant = 1; // Background energy drain (if the creature was sitting still)
const mutationChance = 0.3; // Chance of a mutation occurring upon breeding
const mutationFactor = 0.2; // How large a change can occur within the mutation


var latestFoodId = 0;
var foods = {};
const foodSpawnChance = 0.09; // Chance of spawning food every draw


/**
 * @param {Creature} c - Creature being drawn
 */        
function drawCreature(c){   
    c.grow(); 
    c.move();              

    if(c.energy <= 0){
        c.die();
    }else{    
        if(c.selected){
            ctx.fillStyle = 'red';
            ctx.fillRect(c.x-1, c.y-1, c.img.width*c.scaleFactor+2, c.img.height*c.scaleFactor+2);  
        }
                
        ctx.drawImage(c.img, c.x, c.y, c.img.width*c.scaleFactor, c.img.height*c.scaleFactor);  
        
        ctx.fillStyle = 'green';
        let barWidth = (c.energy >= c.traits.breedingEnergy) ? c.img.width : c.energy / c.traits.breedingEnergy * c.img.width;         
        ctx.fillRect(c.x, c.y + c.img.height*c.scaleFactor + 3, barWidth*c.scaleFactor, 5*c.scaleFactor);
        
        for(var id in foods){
            if(withinArea(foods[id].x, foods[id].y, c.x, c.y, c.img.width*c.scaleFactor, c.img.height*c.scaleFactor)) c.eat(foods[id]);
        }
    }            
}

/**
 * @param {Food} f - Food being drawn
 */        
    function drawFood(f){ 
    ctx.beginPath();    
    ctx.arc(f.x, f.y, f.size, 0, 2*Math.PI);
    ctx.fillStyle = f.colour;
    ctx.fill();                  
}

function spawnFood(){            
    if(Math.random() <= foodSpawnChance) new Food();            
}

// Set initial conditions
function buildWorld(creatureCount, foodCount){
    while(creatureCount){
        new Creature(baseGenome)
        creatureCount--;
    }

    while(foodCount){
        new Food()
        foodCount--;
    }
}

// Draw canvas
function draw(){
    paused = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    spawnFood();

    for(var id in foods){
        drawFood(foods[id]);
    }

    for(var id in creatures){
        drawCreature(creatures[id]);
    }
    
    if(!paused) animation = window.requestAnimationFrame(draw);
}        

// Pause Simulation
function pause(){
    window.cancelAnimationFrame(animation);
    paused = true;
} 


function init(){ 
    buildWorld(3, 8);
    buildStatsUI();  
    draw();
}
        