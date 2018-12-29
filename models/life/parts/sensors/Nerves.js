class Nerves extends Sensor{
    static mutationChance() { return 1; }
    static limit(){ return 1; }

    constructor(creature){
        super(creature); 
        this.locateable = false;

    }

    // TODO: update nerve sense calculations to handle direction and squash
    sense(){
        this.inputs = [];
        let nutrientInput = 0;
        for(let id in Environment.nutrients){
            let nutrient = Environment.nutrients[id];
            if(withinRadius(nutrient.x, nutrient.y, this.creature.x, this.creature.y, this.creature.radius+1)){
                // pass sum of Sense data to creature's brain: M.e^(-S.d^2)
                nutrientInput += 1;                
            }            
        }

        this.inputs.push(nutrientInput);
        
        let toxinInput = 0;
        for(let id in Environment.toxins){
            let toxin = Environment.toxins[id];
            if(withinRadius(toxin.x, toxin.y, this.creature.x, this.creature.y, this.creature.radius+1)){
                // pass sum of Sense data to creature's brain: M.e^(-S.d^2)
                toxinInput += 1;                
            }            
        }

        this.inputs.push(toxinInput);

        let creatureInput = 0;
        for(let id in Life.creatures){
            if(id == this.creature.id) continue;
            let creature = Life.creatures[id];
            if(withinRadius(creature.x, creature.y, this.creature.x, this.creature.y, this.creature.radius+1)){                
                creatureInput += 1;                
            }            
        }

        this.inputs.push(creatureInput);               
    }

    inherit(ear){
        this.distance = mutate(ear.distance, 0, 1);
        this.angle = mutateAngle(ear.distance);
        this.hearingRadius = mutate(ear.hearingRadius, 0);
    }
}