var Life = {
    creatures: {},
    partClasses: { Mouth, Ear, Absorber, Nerves }, // Parts creatures have access to

    update: function (){
        for(var id in this.creatures){
            this.updateCreature(this.creatures[id])
        }
    },

    draw: function(){
        for(var id in this.creatures){
            this.drawCreature(this.creatures[id])
        }
    },

    updateCreature: function(c){
        if(c.energy <= 0){
            c.die();
            return;
        }
    
        // Reset sensory input    
        c.brain.inputs = [];  
        
        // Temporarily manually add speed and turn outputs to brain TODO: remove when there are movement parts
        c.brain.outputs = [0, 0];
    
        // Check all parts and pass in sense data from sensors and prep part inputs
        for(var i = 0; i < c.parts.length; i++){
            let part = c.parts[i];
            if(part.isSensor){
                part.sense(); // Sense the world
                for(var j = 0; j < part.outputs.length; j++){ 
                    c.brain.inputs.push(part.outputs[j]); // Send data to brain
                }   
            }else if(part.inputs){
                for(var j = 0; j < part.inputs.length; j++){
                    c.brain.outputs.push(0);
                }
            }                 
        }
    
        // Yaaargh! Fire the synapses
        let res = c.brain.fire();
    
        // Limit the brain's demands with physical limitations TODO: should be inside the part classes (when exists)
        let speed = (c.direction.m+res[0] > c.traits.speed) ? c.traits.speed : c.direction.m+res[0];
        if(speed < 0) speed = 0;  
    
        let turn = (res[1] > c.traits.turn) ? c.traits.turn : res[1];
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
        if(Object.keys(this.creatures).length < maxCreatures){
            c.reproducer.reproduce(c); 
        }
    
        // TODO: After actions have been taken, update creature state
    
        // Basic collisions
        for(j in this.creatures) {
            var c2 = this.creatures[j];
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
    },
    
    /**
     * @param {Creature} c - Creature being drawn
     */        
    drawCreature: function(c){               
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
}