const maxNutrients = 500;
const maxToxins = 200;

var Environment = {
    mapHeight: 2000,
    mapWidth: 2000,
    nutrients: {},
    toxins: {},

    update: function(){
        // Update nutrients
        this.spawnNutrient();
        this.spawnToxin();
    },

    draw: function(){
        for(var id in this.nutrients){
            this.drawNutrient(this.nutrients[id]);
        }
    
        for(var id in this.toxins){
            this.drawToxin(this.toxins[id]);
        }
    },

    spawnNutrient: function (){            
        if(Object.keys(this.nutrients).length < maxNutrients && Math.random() <= nutrientSpawnChance) new Nutrient();            
    },
    
    spawnToxin: function (){            
        if(Object.keys(this.toxins).length < maxNutrients &&Math.random() <= toxinSpawnChance) new Toxin();            
    },    

    /**
     * @param {Nutrient} n - Nutrient being drawn
     */        
    drawNutrient: function (n){ 
        if(n.energy <= 0){
            delete this.nutrients[n.id];
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