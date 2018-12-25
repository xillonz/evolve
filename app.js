// --- Game constants ---
var canvas = document.getElementById('world');
canvas.width  = 900;
canvas.height = 600;
var ctx = canvas.getContext('2d');  
var animation;
var paused = true;


const eyeAngle = 0.6; // Angle of eyes from front of body
const eyeGap = 1;
const eyeSensitivity= 0.0005; //how sensitive is the eye? decrease for more sensitivity...
const eyeMult= 0.5; //linear multiplier on strength of eye.

// ----------------------------------------------------------------------


/**
 * @param {Creature} c - Creature being drawn
 */        
function drawCreature(c){ 
    if(c.energy <= 0){
        c.die();
    }else{           
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

        // Draw eyes
        let eyeDistance = c.radius + eyeGap;  
        Lx = c.x + eyeDistance*Math.cos(c.direction.a - eyeAngle);
        Ly = c.y + eyeDistance*Math.sin(c.direction.a - eyeAngle);
        Rx = c.x + eyeDistance*Math.cos(c.direction.a + eyeAngle);
        Ry = c.y + eyeDistance*Math.sin(c.direction.a + eyeAngle);

        ctx.beginPath();
        ctx.arc(Lx, Ly, eyeGap*2+2, 0, 2 * Math.PI);
        ctx.fillStyle = "skyblue";
        ctx.fill(); 
        ctx.beginPath();
        ctx.arc(Rx, Ry, eyeGap*2+2, 0, 2 * Math.PI);
        ctx.fillStyle = "skyblue";
        ctx.fill(); 

        // Draw energy bar
        ctx.fillStyle = 'lightgreen';
        let barWidth = (c.energy >= c.traits.breedingEnergy) ? 2*c.radius : c.energy / c.traits.breedingEnergy * 2*c.radius;         
        ctx.fillRect(c.x-c.radius, c.y + c.radius + 4, barWidth, 4);

        // Reset sensory input
        c.brain.sL = 0;
        c.brain.sR = 0;
        
        //TODO: Move logic like this outside of draw functions but without causing more loops if poss
        for(let id in foods){
            let food = foods[id];
            if(withinRadius(food.x, food.y, c.x, c.y, c.brain.senseRadius)){
                // pass sum of Sense data to creature's brain: M.e^(-S.d^2)
                c.brain.sL += eyeMult*Math.exp(-eyeSensitivity*(Math.pow(Lx-food.x,2) + Math.pow(Ly-food.y,2)));
                c.brain.sR += eyeMult*Math.exp(-eyeSensitivity*(Math.pow(Rx-food.x,2) + Math.pow(Ry-food.y,2)));

                if(withinRadius(food.x, food.y, c.x, c.y, c.radius)) c.eat(food);
            }            
        }

        let colour = Math.round(c.brain.sL*255.0); 
        if(colour>255) colour=255;
        ctx.beginPath();
        ctx.arc(Lx, Ly, eyeGap*2, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgb('+colour+','+colour+','+colour+')';
        ctx.fill(); 

        colour = Math.round(c.brain.sR*255.0); 
        if(colour>255) colour=255;
        ctx.beginPath();
        ctx.arc(Rx, Ry, eyeGap*2, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgb('+colour+','+colour+','+colour+')';
        ctx.fill(); 

        // Yaaargh! Fire the synapses
        let res = c.brain.fire();

        c.direction = vector(c.direction.a+res,c.direction.m);

        c.grow(); 
        c.move();  
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

    if(Object.keys(creatures).length < 1) new Creature(baseGenome);

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
    buildWorld(10, 30);
    buildStatsUI();  
    draw();
}
        