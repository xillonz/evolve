class Nerves extends Sensor{
    static mutationChance() { return 1; }
    static limit(){ return 1; }

    constructor(creature){
        super(creature); 
        this.locateable = false;

        this.outputs = {
            nutrients: new PartConnection(),
            toxins: new PartConnection(),
            creatures: new PartConnection(),
            energy: new PartConnection()
        }
    }

    // TODO: update nerve sense calculations to handle direction
    receiveStimuli(){
        this.outputs.energy.value = this.creature.energy; // Sense own energy level

        let count = 0;
        let nutrientInput = 0;
        for(let id in Environment.nutrients){
            let nutrient = Environment.nutrients[id];
            if(withinRadius(nutrient.x, nutrient.y, this.creature.x, this.creature.y, this.creature.radius+2)){
                // pass sum of Sense data to creature's brain: M.e^(-S.d^2)
                count += 1;   
                nutrientInput += getAngleRad(nutrient.x, nutrient.y, this.creature.x, this.creature.y);
            }            
        }
        let result = (count) ? nutrientInput/count : 0;
        this.outputs.nutrients.value = result;
        
        count = 0;
        let toxinInput = 0;
        for(let id in Environment.toxins){
            let toxin = Environment.toxins[id];
            if(withinRadius(toxin.x, toxin.y, this.creature.x, this.creature.y, this.creature.radius+2)){
                // pass sum of Sense data to creature's brain: M.e^(-S.d^2)
                count += 1;  
                toxinInput += getAngleRad(toxin.x, toxin.y, this.creature.x, this.creature.y);
            }            
        }

        result = (count) ? toxinInput/count : 0;
        this.outputs.toxins.value = result;

        count = 0;
        let creatureInput = 0;
        for(let id in Life.creatures){
            if(id == this.creature.id) continue;
            let creature = Life.creatures[id];
            if(withinRadius(creature.x, creature.y, this.creature.x, this.creature.y, this.creature.radius+2)){  
                count += 1;                
                creatureInput += getAngleRad(creature.x, creature.y, this.creature.x, this.creature.y);   
                
                if(isNaN(creatureInput)){
                    console.log('foreign: ', creature)                    
                    console.log('this: ', this.creature)
                    App.pause();
                    throw 'fuck'
                }
            }            
        }

        result = (count) ? creatureInput/count : 0;
        this.outputs.creatures.value = result;    
    }
}