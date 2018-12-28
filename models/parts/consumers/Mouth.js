class Mouth extends Part{
    static mutationChance() { return 0.2; }

    constructor(creature){
        super(creature);
        this.locatable = true;
        this.radius = 4;
        this.distance = 0.8; // Distance from center in units of creature size
        this.angle = randomFloat(0, 2*Math.PI); // Angle from front of creature
        this.x = 0;
        this.y = 0;

        this.colour = {
            r: 200,
            g: 50,
            b: 50
        };
    }   

    inherit(mouth){
        mouthMutation = true;
        this.radius = mutate(mouth.radius);
        // this.distance = mutate(mouth.distance);
        this.angle = mutateAngle(mouth.angle);

        mouthMutation = false;
    }

    // Bite
    act(){
        for(let id in foods){
            let food = foods[id];   
            if(food.size() <= this.radius && withinRadius(food.x, food.y, this.x, this.y, this.radius)){
                this.creature.energy += food.energy;
                delete foods[food.id];
            }
        }
    }
}