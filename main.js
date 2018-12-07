var App = {
    fps: 30,
    environment: {
        x: 200,
        y: 200
    },
    food: [],
    foodMax: 20,
    creatures: [],
    creatureMax: 10,
    generateCreatures: function(){
        App.food = [];
        for(var i = 0; i < App.creatureMax; i++){
            let x = Math.floor(Math.random() * App.environment.x) + 1;
            let y = Math.floor(Math.random() * App.environment.y) + 1;
            App.creatures.push({
                x: x,
                y: y,
                e: 1000
            });
        }        
    },
    moveCreatures: function(){
        for(var i = 0; i < App.creatures.length; i++){
            let creature = App.creatures[i];
            let x = Math.floor(Math.random() * App.environment.x) + 1;
            let y = Math.floor(Math.random() * App.environment.y) + 1;
            App.food.push({
                x: x,
                y: y
            });
        }      
    },
    generateFood: function(qty){
        App.food = [];
        for(var i = 0; i < qty; i++){
            let x = Math.floor(Math.random() * App.environment.x) + 1;
            let y = Math.floor(Math.random() * App.environment.y) + 1;
            App.food.push({
                x: x,
                y: y
            });
        }        
    },
    init: function(){

    }
}