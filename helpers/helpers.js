// ---- Helper functions ----
// Generate a random Integer between (inc) two numbers
function randomInt(min, max){ // min and max included        
    return Math.floor(Math.random()*(max-min+1)+min);
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// Gets the distance squared between two points, can be passed root=true to get the actual distance
function distance(x1, y1, x2, y2, root){
    if(typeof root === 'undefined') root = false;
    var distancesquared = (x1 - x2)**2 + (y1 - y2)**2;
    return (root) ? Math.sqrt(distancesquared) : distancesquared;
}

function getAngleRad(x1,y1,x2,y2) {
    if(x1 == x2 && y1 == y2 ) return 0;

    var angleRad = Math.atan((y1-y2)/(x1-x2));

    return angleRad;
}

function getAngleDeg(x1,y1,x2,y2) {
    if(x1 == x2 && y1 == y2 ) return 0;

    var angleRad = Math.atan((y1-y2)/(x1-x2));
    var angleDeg = angleRad * 180 / Math.PI;

    return angleDeg;
}

// Check if a location is within a rectangular area given top left corner pos and dimensions of rectangle
function withinArea(x, y, xMin, yMin, width, height){
    return x > xMin && x < xMin + width && y > yMin && y < yMin + height;
}

function withinRadius(x1, y1, x2, y2, radius) {
    var distancesquared = (x1 - x2)**2 + (y1 - y2)**2;
    return distancesquared <= radius**2;
}

function vector(a, m, x, y){
    if(a>2*Math.PI) a = a-2*Math.PI;
    if(a<0) a = 2*Math.PI+a;

    if(arguments.length === 2){
        x = Math.cos(a)*m;
        y = Math.sin(a)*m;
    }

    if(x === -0) x = 0;
    if(y === -0) y = 0;
    
    return {
        x: x, //x length
        y: y, //y length
        a: a, //angle
        m: m  //hypotenuse
    }
}

// Generate a random vector (with direction and speed) between a min and max angle
function randomVector(minA, maxA, magnitude){
    if(typeof minA === 'undefined') minA = 0;
    if(typeof maxA === 'undefined') maxA = 360;
    if(typeof magnitude === 'undefined') magnitude = 1;
    let angle = randomInt(minA, maxA) * (Math.PI / 180);

    return vector(angle, magnitude);  
}

// Count number of instances of class in an array
function countClass(a, c){
    let count = 0;  
    for(var i = 0; i < a.length; i++){
        if(a[i] instanceof c) count++;
    }
    return count;
}
// --------------------------

function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
}

// Copy object - can't copy methods
function copyObject(target){
    return JSON.parse(JSON.stringify(target));
}

function oLength(object){
    return Object.keys(object).length
}