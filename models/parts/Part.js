class Part{
    static mutationChance() { return 0.2; } //Base mutation chance of creature parts
    static limit(){ return 10; } // Limit of number of parts of type on creature

    constructor(creature){
        
        this.creature = creature;
        this.locatable = true;  
        this.isSensor = false;

        this.colour = {
            r: 0,
            g: 0,
            b: 0
        };

        this.x = 0;
        this.y = 0;
    }

    inherit(){
        
    }
}