// ---- Helper functions ----
// Generate a random Integer between (inc) two numbers
function randomInt(min,max){ // min and max included        
    return Math.floor(Math.random()*(max-min+1)+min);
}

// Check if a location is within a rectangular area given top left corner pos and dimensions of rectangle
function withinArea(x, y, xMin, yMin, width, height){
    return x > xMin && x < xMin + width && y > yMin && y < yMin + height;
}

// Generate a random vector (with direction and speed) between a min and max angle
function randomVector(minA, maxA, magnitude){
    if(typeof minA === 'undefined') minA = 0;
    if(typeof maxA === 'undefined') maxA = 360;
    if(typeof magnitude === 'undefined') magnitude = 1;
    let angle = randomInt(minA, maxA);
    let xDir = Math.cos(angle * (Math.PI / 180));
    let yDir = Math.sin(angle * (Math.PI / 180));

    return {
        x: xDir*magnitude, 
        y: yDir*magnitude
    };
}
// --------------------------