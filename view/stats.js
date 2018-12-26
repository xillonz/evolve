// TODO: rebuild this whole file

function showCreatureInfo(c){
    for(let i in creatures){
        creatures[i].selected = false;
    }
    c.selected = true;
    $('#generation').text(c.generation);
    $('#age').text(c.age);
    $('#current-speed').text(c.direction.m);

    for(var i = 0; i < inheritable.length; i++){
        $(`#${inheritable[i]}-info`).text(c.traits[inheritable[i]]);                  
    } 
}

function buildStatsUI(){
    for(var i = 0; i < inheritable.length; i++){
        $('#inheritable-info').append(`<strong>${inheritable[i]}: </strong><div id="${inheritable[i]}-info"></div>`);
        $('#inheritable-average').append(`<strong>Average ${inheritable[i]}: </strong><div id="${inheritable[i]}-average"></div>`);
    }

    // Show stats
    setInterval(function(){
        let totals = {};
        let count = 0;
        for(let i in creatures){
            for(var j = 0; j < inheritable.length; j++){
                if(!totals[inheritable[j]]) totals[inheritable[j]] = 0;
                totals[inheritable[j]] += creatures[i].traits[inheritable[j]];                    
            }           
            count++;
        }

        $('#total-creatures').text(count);

        for(var i = 0; i < inheritable.length; i++){
            $(`#${inheritable[i]}-average`).text(Math.round((totals[inheritable[i]]/count + 0.00001) * 100) / 100);                  
        } 
    
    }, 1000);

    canvas.addEventListener('click', (e) => {  
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        for(let i in creatures){
            let c = creatures[i];
            if(withinArea(x, y, c.x, c.y, c.radius, c.radius)){
                showCreatureInfo(c);
            }
        }          
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.code == 'Pause'){
            (paused) ? draw() : pause();
        }
    });
}