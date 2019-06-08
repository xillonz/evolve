const energyDrainFactor = 0.0001; // Factor by how much energy is drained per draw - could be tail efficiency somehow

// TODO: make movement in direction of tail location relative to creature centre (maybe just set initial creature direction based on tail location?)

class Tail extends Part{
    static mutationChance() { return 1; }
    static limit(){ return 1; }

    constructor(creature){
        super(creature);

        this.radius = 4;
        this.distance = 1; // Distance from center in units of creature size
        this.angle = randomFloat(0, 2*Math.PI); // Angle from front of creature
        this.x = 0;
        this.y = 0;

        this.speedFactor = 1;
        this.turnFactor = 0.1;

        this.colour = {
            r: 30,
            g: 50,
            b: 230
        };

        this.inputs = {
            speed: new PartConnection(),
            turn: new PartConnection(),
        }
    }   

    inheritFeatures(tail){
        this.maxSpeed = mutate(tail.speedFactor);
        this.maxTurn = mutate(tail.turnFactor);

        this.angle = mutate(tail.angle);
    }
    
    act(){
        // Move & Turn
        let c = this.creature; 
        
        let speed = this.speedFactor * this.inputs.speed.getSigmoid();
        let turn = this.turnFactor * this.inputs.turn.getBounded(); 


        // TODO: store direction inside part/creature vector array, then have creature combine vectors for final creature vector
        c.direction = vector(c.direction.a+turn, speed);     
        
        //TODO: add energy drain for turning (perhaps changing tail angle or something)
        
        c.energy -= energyDrainFactor*c.radius*c.direction.m*c.direction.m; // Reduce creatures energy: D.m.v²
    }
}