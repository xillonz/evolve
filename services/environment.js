const maxNutrients = 1000;
const maxToxins = 200;

var Environment = {
    width: 4000,
    height: 2600,
    nutrients: {},
    toxins: {},

    update: function(){
        // Update nutrients
        this.spawnNutrient();
        this.spawnToxin();
    },

    draw: function(){        
        this.drawBackground();
        this.drawEdges();

        for(var id in this.nutrients){
            this.drawNutrient(this.nutrients[id]);
        }
    
        for(var id in this.toxins){
            this.drawToxin(this.toxins[id]);
        }        
    },

    drawBackground: function(){
        ctx.fillStyle = "#FFF";
        ctx.fillRect(0, 0, this.width, this.height);
    },

    drawEdges: function(){
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, this.height);
        ctx.lineTo(this.width, this.height);
        ctx.lineTo(this.width, 0);
        ctx.lineTo(0, 0);
        ctx.stroke();
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