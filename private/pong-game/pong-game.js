// SELECT CANVAS
const canvas = document.getElementById("pong");
const ctx = canvas.getContext('2d');


// LOAD SOUNDS
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
comScore.src = "sounds/comScore.mp3";
userScore.src = "sounds/userScore.mp3";

// CREATE THE BALL
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "WHITE"
}
// CREATE THE USER PADDLE
const user = {
    x : 0, // left side of canvas
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}
// CREATE THE COM PADDLE
const com = {
    x : canvas.width - 10, // - width of paddle
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}
// CREATE THE NET
const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
}

// DRAW RECT FUNCTION
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}
// DRAW CIRCLE
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}
// DRAW NET
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}
// DRAW TEXT
function drawText(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

// CONTROL THE USER PADDLE
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    
    user.y = evt.clientY - rect.top - user.height/2;
}

// RESET BALL
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

// DETECTING COLLISION (b = BALL, p = PLAYER)
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// UPDATE: POS, MOV, SCORE, ETC.
function update() {
    // Update the score
    if( ball.x - ball.radius < 0 ){
        com.score++;
        comScore.play();
        resetBall();
    }else if( ball.x + ball.radius > canvas.width){
        user.score++;
        userScore.play();
        resetBall();
    }
    // Ball Velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    // AI that controls the com paddle
    com.y += ((ball.y - (com.y + com.height/2)))*0.1;

    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
        wall.play();
    }
    // Check if paddle hit the user or com paddle
    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;

    if(collision(ball,player)){
        // Play Sound
        hit.play();
        // Where the ball hit the player
        let collidePoint = (ball.y - (player.y + player.height/2));
        // Normalization
        collidePoint = collidePoint / (player.height/2);
        // Calculate angle in Radian
        let angleRad = (Math.PI/4) * collidePoint;
        // X direction of the ball when it's hit
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        // Ball hit's paddle, Ball speed increases
        ball.speed += 0.3;
    }
}

// RENDER THE GAME
function render() {
    // Clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    // Draw the user score to the left
    drawText(user.score,canvas.width/4,canvas.height/5);
    // Draw the COM score to the right
    drawText(com.score,3*canvas.width/4,canvas.height/5);
    // Draw the net
    drawNet();
    // Draw the user's paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);
    // Draw the COM's paddle
    drawRect(com.x, com.y, com.width, com.height, com.color);
    // Draw the ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

// GAME INIT
function game(){
    update();
    render();
}

let framePerSecond = 50;
// LOOP - CALL GAME(); 50 TIMES EVERY 1000MS = 1SEC
let loop = setInterval(game,1000/framePerSecond);


