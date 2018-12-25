// ---- Helper functions ----
// Generate a random Integer between (inc) two numbers
function randomInt(min, max){ // min and max included        
    return Math.floor(Math.random()*(max-min+1)+min);
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

// Check if a location is within a rectangular area given top left corner pos and dimensions of rectangle
function withinArea(x, y, xMin, yMin, width, height){
    return x > xMin && x < xMin + width && y > yMin && y < yMin + height;
}

function withinRadius(x, y, cx, cy, radius) {
    var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
    return distancesquared <= radius * radius;
}

function vector(a, m, x, y){
    if(a>2*Math.PI) a = a-2*Math.PI;
    if(a<0) a = 2*Math.PI+a;

    if(arguments.length === 2){
        x = Math.cos(a)*m;
        y = Math.sin(a)*m;
    }

    return {
        x: x,
        y: y,
        a: a,
        m: m
    }
}

// Generate a random vector (with direction and speed) between a min and max angle
function randomVector(minA, maxA, magnitude){
    if(typeof minA === 'undefined') minA = 0;
    if(typeof maxA === 'undefined') maxA = 360;
    if(typeof magnitude === 'undefined') magnitude = 1;
    let angle = randomInt(minA, maxA) * (Math.PI / 180);
    let xDir = Math.cos(angle);
    let yDir = Math.sin(angle);

    return vector(angle, magnitude, xDir*magnitude, yDir*magnitude);  
}
// --------------------------