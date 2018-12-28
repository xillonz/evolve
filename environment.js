const maxNutrients = 500;

var environment = {
    update: function(){
        // Update nutrients
        this.spawnNutrient();
        this.spawnToxin();
    },

    spawnNutrient: function (){            
        if(Object.keys(nutrients).length < maxNutrients && Math.random() <= nutrientSpawnChance) new Nutrient();            
    },
    
    spawnToxin: function (){            
        if(Math.random() <= toxinSpawnChance) new Toxin();            
    },

    draw: function(){
        for(var id in nutrients){
            this.drawNutrient(nutrients[id]);
        }
    
        for(var id in toxins){
            this.drawToxin(toxins[id]);
        }
    },

        /**
     * @param {Nutrient} n - Nutrient being drawn
     */        
    drawNutrient: function (n){ 
        if(n.energy <= 0){
            delete nutrients[n.id];
            return;
        }

        ctx.beginPath();    
        ctx.arc(n.x, n.y, n.size(), 0, 2*Math.PI);
        ctx.fillStyle = n.colour;
        ctx.fill();                  
    },

    /**
     * @param {Toxin} n - Toxin being drawn
     */        
    drawToxin: function (t){ 
        ctx.beginPath();    
        ctx.arc(t.x, t.y, t.toxicity, 0, 2*Math.PI);
        ctx.fillStyle = t.colour;
        ctx.fill();                  
    }

}