class Sensor extends Part{
    constructor(creature){
        super(creature);
        this.isSensor = true;
        this.outputs = [];
    }
}