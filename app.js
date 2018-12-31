// --- Game constants ---
var canvas = document.getElementById('world');
canvas.width  = 900;
canvas.height = 600;
var ctx = canvas.getContext('2d');  
var drawing, updating;

const maxCreatures = 30;
const minCreatures = 5;


// ----------------------------------------------------------------------

var App = {
    paused: true,
    updateFPS: 60,
    init: function(){ 
        this.buildWorld(12, 30);
        buildStatsUI(); // TODO: change after stats organised 
        this.bind();
        this.startUpdate();
        this.draw();
    },

    // Bind key/click events
    bind: function(){
        document.addEventListener('keydown', function(event) {            
            switch(event.code){
                case 'Pause':
                    if(App.paused){
                        App.startUpdate();
                        App.draw();
                    }else{
                        App.pause();
                    }
                    break;
                case 'ArrowRight':
                    App.changeSpeed(10);
                    break;
                case 'ArrowLeft':
                    App.changeSpeed(-10);
                    break;
                case 'KeyW':
                    ctx.translate(0, 5);
                    break;
                case 'KeyA':
                    ctx.translate(5, 0);
                    break;
                case 'KeyS':
                    ctx.translate(0, -5);
                    break;
                case 'KeyD':
                    ctx.translate(-5, 0);
                    break;
            } 
        }); 

        var mouseIsDown = false;
        var dragStart = {x: 0, y: 0};
        var dragEnd = {x: 0, y: 0};
 
        canvas.onmousedown = function(e){
            dragStart.x = e.pageX - canvas.offsetLeft;
            dragStart.y = e.pageY - canvas.offsetTop;

            mouseIsDown = true;
        }
        canvas.onmouseup = function(e){
            if(mouseIsDown) mouseClick(e);

            mouseIsDown = false;
        }

        canvas.onmousemove = function(e){
            if(!mouseIsDown) return;

            dragEnd = {
                x: e.pageX - canvas.offsetLeft,
                y: e.pageY - canvas.offsetTop
            }

            let dx = dragEnd.x - dragStart.x;
            let dy = dragEnd.y - dragStart.y;

            let curTransform = ctx.getTransform();   
            
            let borderSize = 300;

            if(curTransform.e + dx > borderSize*curTransform.a && dx > 0) dx = 0;
            if(curTransform.f + dy > borderSize*curTransform.a && dy >0) dy = 0;
            if(curTransform.e + dx - canvas.width < -1*(Environment.width + borderSize)*curTransform.a && dx < 0) dx = 0;
            if(curTransform.f + dy - canvas.height < -1*(Environment.height + borderSize)*curTransform.a  && dy < 0) dy = 0;

            ctx.translate(dx/curTransform.a, dy/curTransform.d);

            dragStart = dragEnd;

            return false;
        }

        // Zoom
        canvas.onwheel = function(e){
            var mousePos = getMousePos(canvas, e);

            ctx.translate(mousePos.x, mousePos.y);

            // TODO: consider adding zoom limits
            if(e.wheelDelta>0){
                ctx.scale(1.2, 1.2)
            }else{
                ctx.scale(0.8, 0.8)
            }

            ctx.translate(-mousePos.x, -mousePos.y);
        }

        function mouseClick(e){
            // click action
        }
    },

    // Set initial conditions
    buildWorld: function(creatureCount, nutrientCount){
        while(creatureCount){
            new Creature()
            creatureCount--;
            
        }

        while(nutrientCount){
            new Nutrient()
            nutrientCount--;
        }
    },

    // Process game logic
    update: function(){

        if(Object.keys(Life.creatures).length < minCreatures){
            // for(var i in creatures){ // inherit from last creatures
                new Creature() // new Creature(creatures[i])
            // }        
        }

        Environment.update();
        
        Life.update();
        
    },

    // Draw canvas
    draw: function(){
        App.paused = false; 

        App.clear();

        Environment.draw();

        Life.draw();
        
        if(!App.paused) drawing = window.requestAnimationFrame(App.draw);
    },   

    clear: function(){
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas          
        ctx.restore();
    },

    startUpdate: function(){
        $('#fps').text(App.updateFPS);
        updating = setInterval(App.update, 1000/App.updateFPS);
    },

    // Pause Simulation
    pause: function(){
        clearInterval(updating);
        window.cancelAnimationFrame(drawing);
        App.paused = true;
    }, 

    // Change updating (logic) speed
    changeSpeed: function(change){
        clearInterval(updating);
        App.updateFPS += change;
        if(App.updateFPS < 10) App.updateFPS = 10;
        this.startUpdate();
    }
}