// --- Game constants ---
var canvas = document.getElementById('world');
canvas.width  = 900;
canvas.height = 600;
var ctx = canvas.getContext('2d');  
var animation, processing;
var processFPS = 60;
var paused = true;

const maxFood = 500;
const maxCreatures = 18;
const minCreatures = 5;

var partClasses = { Mouth, Ear, Absorber } // Parts creatures have access to


// ----------------------------------------------------------------------


function updateCreature(c){
    if(c.energy <= 0){
        c.die();
        return;
    }

    // Reset sensory input    
    c.brain.inputs = [];    

    // Check all sensors
    for(var i = 0; i < c.parts.length; i++){
        let sensor = c.parts[i];
        if(!sensor.isSensor) continue;
        sensor.sense(); // Sense the world
        for(var j = 0; j < sensor.inputs.length; j++){ 
            c.brain.inputs.push(sensor.inputs[j]); // Send data to brain
        }        
    }

    // Yaaargh! Fire the synapses
    let res = c.brain.fire();

    // TODO: Brain orders should be dynamic for the output parts available
    // Limit the brain's demands with physical limitations
    let speed = (c.direction.m+res.speed > c.traits.speed) ? c.traits.speed : c.direction.m+res.speed;
    if(speed < 0) speed = 0;  

    let turn = (res.turn > c.traits.turn) ? c.traits.turn : res.turn;
    if(turn < -c.traits.turn) turn = -c.traits.turn;    
    

    // Carry out the orders 
    c.move(turn, speed); 
    c.grow(); 

    for(var i = 0; i < c.parts.length; i++){
        let part = c.parts[i];

        // Update part location
        part.x = c.x + c.radius*part.distance*Math.cos(c.direction.a - part.angle);
        part.y = c.y + c.radius*part.distance*Math.sin(c.direction.a - part.angle);
        
        // Act upon the world if capable
        if(!part.isSensor) part.act(c);             
    }

    // Attempt to reproduce if creature limit is not hit
    if(Object.keys(creatures).length < maxCreatures){
        c.reproducer.reproduce(c); 
    }

    // TODO: After actions have been taken, update creature state

    // Basic collisions
    for(j in creatures) {
        var c2 = creatures[j];
        if(c2===c) continue;
        var d= Math.sqrt(Math.pow(c.x-c2.x,2) + Math.pow(c.y-c2.y,2));
        var overlap= c.radius+c2.radius-d;
        if(overlap>0 && d>1){
            //one creature pushes on another proportional to its speed and size.
            var aggression= c2.direction.m*c2.radius/(c.direction.m*c.radius+c2.direction.m*c2.radius);
            if(c.direction.m<0.01 && c2.direction.m<0.01) aggression=0.5;
            var ff2= (overlap*aggression)/d;
            var ff1= (overlap*(1-aggression))/d;
            c2.x+= (c2.x-c.x)*ff2;
            c2.y+= (c2.y-c.y)*ff2;
            c.x-= (c2.x-c.x)*ff1;
            c.y-= (c2.x-c.x)*ff1;
        }
    }
}

/**
 * @param {Creature} c - Creature being drawn
 */        
function drawCreature(c){               
    if(c.selected){
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius+2, 0, 2 * Math.PI);
        ctx.fill();  
    }
    // ctx.drawImage(c.img, c.x, c.y, c.img.width*c.scaleFactor, c.img.height*c.scaleFactor); 
    // Draw body
    var gradient = ctx.createRadialGradient(c.x, c.y, c.radius*0.1, c.x, c.y, c.radius);
    gradient.addColorStop(0, 'skyblue');
    gradient.addColorStop(1, 'dodgerblue');
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill(); 

    // Draw parts
    for(var i = 0; i < c.parts.length; i++){
        let part = c.parts[i];
        if(!part.locatable) continue;
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(${part.colour.r}, ${part.colour.g}, ${part.colour.b})`;
        ctx.fill(); 
    }

    // TODO: add animation to sensory input
    // // Colour eyes 
    // let colour = Math.round(c.brain.inputs.sL*255.0); 
    // if(colour>255) colour=255;
    // ctx.beginPath();
    // ctx.arc(Lx, Ly, eyeGap*2, 0, 2 * Math.PI);
    // ctx.fillStyle = 'rgb('+colour+','+colour+','+colour+')';
    // ctx.fill(); 

    // colour = Math.round(c.brain.inputs.sR*255.0); 
    // if(colour>255) colour=255;
    // ctx.beginPath();
    // ctx.arc(Rx, Ry, eyeGap*2, 0, 2 * Math.PI);
    // ctx.fillStyle = 'rgb('+colour+','+colour+','+colour+')';
    // ctx.fill(); 

    // Draw energy bar
    ctx.fillStyle = 'khaki';
    let barWidth = (c.energy >= c.reproducer.breedingEnergy) ? 2*c.radius : c.energy / c.reproducer.breedingEnergy * 2*c.radius;         
    ctx.fillRect(c.x-c.radius, c.y + c.radius + 4, barWidth, 4);            
}

/**
 * @param {Food} f - Food being drawn
 */        
    function drawFood(f){ 
        if(f.energy <= 0){
            delete foods[f.id];
            return;
        }

        ctx.beginPath();    
        ctx.arc(f.x, f.y, f.size(), 0, 2*Math.PI);
        ctx.fillStyle = f.colour;
        ctx.fill();                  
    }

function spawnFood(){            
    if(Object.keys(foods).length < maxFood && Math.random() <= foodSpawnChance) new Food();            
}

// Set initial conditions
function buildWorld(creatureCount, foodCount){
    while(creatureCount){
        new Creature()
        creatureCount--;
        
    }

    while(foodCount){
        new Food()
        foodCount--;
    }
}

// Process game logic
function process(){

    if(Object.keys(creatures).length < minCreatures){
        // for(var i in creatures){ // inherit from last creatures
            new Creature() // new Creature(creatures[i])
        // }        
    }

    // Update foods
    spawnFood();

    for(var id in creatures){
        updateCreature(creatures[id]);
    }
}

// Draw canvas
function draw(){
    paused = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas       

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
    clearInterval(processing);
    window.cancelAnimationFrame(animation);
    paused = true;
} 

function startProcess(){
    $('#fps').text(processFPS);
    processing = setInterval(process, 1000/processFPS);
}

function init(){ 
    buildWorld(12, 30);
    buildStatsUI();  
    startProcess();
    draw();
}

function changeSpeed(change){
    clearInterval(processing);
    processFPS += change;
    if(processFPS < 10) processFPS = 10;
    startProcess();
}


document.addEventListener('keydown', function(event) {
    switch(event.code){
        case 'Pause':
            if(paused){
                startProcess();
                draw();
            }else{
                pause();
            }
            break;
        case 'ArrowRight':
            changeSpeed(10);
            break;
        case 'ArrowLeft':
            changeSpeed(-10);
            break;
    }
 
}); 


// TODO:
//  - Add energy use to brain and parts
//  - Balance food