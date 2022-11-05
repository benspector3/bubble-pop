/* global $*/

/////////////////////////////////////////////////////////////////////////////
//////////////////////////// VARIABLES //////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////


// Set window sessionStorage to keep track of high scores (lowest time)
sessionStorage.setItem("lowestTime", Infinity);
sessionStorage.setItem("lowestTimeStr", "0:00");

// timer variables
var timer = $('#timer');
var timeStr;
var time;

// board variables
var board = $('#board');
var boardWidth = board.width();
var boardHeight = $(window).height();

// bubble variables
var bubblesLeft;
var bubbles;

// interval variables
var updateInterval;
var timerInterval;


/////////////////////////////////////////////////////////////////////////////
//////////////////////////// GAME SETUP /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

// init();

/* 
 * Reset the clock, the bubbles and the intervals
 * Create a new set of bubbles
 * Start the intervals
 */
function init() {
  
  var pointsPerBubble = prompt("Points per bubble") || 1;
  var maxBubbles = prompt("Max Bubbles") || 10;
  
  bubbles = [];
  for (var i = 0; i < maxBubbles; i++) {
    var bubble = makeBubble(pointsPerBubble);
    bubbles.push(bubble);
    board.append(bubble);
  }
  
  bubblesLeft = bubbles.length;
  
  // start the timer
  timer.text("0:00");
  time = 0;
  timerInterval = setInterval(updateTimer, 1000);
  
  //start game running
  updateInterval = setInterval(update, 50);
}

/////////////////////////////////////////////////////////////////////////////
//////////////////////////// GAME LOGIC /////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

/* 
* On each update tick update each bubble's position and check for
* collisions with the walls.
*/
function update() {
  for (var i = 0; i < bubbles.length; i++) {
    var bubble = bubbles[i];
    updateBubblePosition(bubble);
    keepInBounds(bubble);
  }
  
  if (bubblesLeft === 0) {
    endGame();
  }
}

function updateBubblePosition(bubble) {
  bubble.x += (bubble.directionX * bubble.speed);
  bubble.y += (bubble.directionY * bubble.speed);
  bubble.css('left', bubble.x);
  bubble.css('top', bubble.y);
}

function keepInBounds(bubble) {
  if (bubble.x + 70 > boardWidth) {
    bubble.directionX = -1;
  }
  else if (bubble.x < 0) {
    bubble.directionX = 1;
  }

  if (bubble.y + 70 > boardHeight) {
    bubble.directionY = -1;
  }
  else if (bubble.y < 0) {
    bubble.directionY = 1;
  }
}

/* Making Bubbles */
function makeBubble(pointsPerBubble) {
  // make the bubble Object
  var bubble = $('<div>')
    .addClass('bubble')
    .css('background-color', randomRGB())
    .text(pointsPerBubble);
    
  // set bubble movement properties
  bubble.x = Math.round(Math.random() * boardWidth);
  bubble.y = Math.round(Math.random() * boardHeight);
  bubble.speed = 10;
  bubble.directionX = Math.round(Math.random()) ? 1 : -1;
  bubble.directionY = Math.round(Math.random()) ? 1 : -1;

  // initialize bubble points total
  bubble.points = pointsPerBubble;

  // set bubble click behavior
  bubble.on('click', () => handleBubbleClick(bubble));

  return bubble;
}

/* 
 * When clicking on a bubble increase the bubble's speed,
 * decrement its point value, and if the point value hits 0 
 * remove it
 */
function handleBubbleClick(bubble) {
  bubble.speed += 3;
  bubble.points--;
  if (bubble.points === 0) {
    popBubble(bubble);
  }
  bubble.text(bubble.points);
}

/////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

/* 
* Each rgb value will be between 0 and 255
*/
function randomRGB() {
  var r = Math.round(50 + Math.random() * 205);
  var g = Math.round(50 + Math.random() * 205);
  var b = Math.round(50 + Math.random() * 205);
  return "rgb(" + r + "," + g + "," + b + ")";
}

/* 
 * When removing a bubble, animate the width and height down to
 * 0 over 0.1 seconds and after the animation completes, remove
 * the bubble from the DOM and decrement the bubblesLeft
 */
function popBubble(bubble) {
  bubble.animate({ height: 0, width: 0 }, 100, function() {
    bubble.remove();
    bubblesLeft--;
  });
}

function updateTimer() {
  time++;
  var secondsOnes = (time % 60) % 10;
  var secondsTens = Math.floor((time % 60) / 10);
  var minutes = Math.floor(time / 60);
  timeStr = minutes + ":" + secondsTens + secondsOnes;
  timer.text(timeStr);
}

function endGame() {
  clearInterval(updateInterval);
  clearInterval(timerInterval);
  
  var lowestTime = sessionStorage.getItem("lowestTime");
  var lowestTimeStr = sessionStorage.getItem("lowestTimeStr");
  
  if (time < lowestTime) {
    sessionStorage.setItem("lowestTime", time);
    sessionStorage.setItem("lowestTimeStr", timeStr);
    lowestTime = time;
    lowestTimeStr = timeStr;
  }
  
  alert("Game Over\nTime: " + timeStr + "\nHigh Score: " + lowestTimeStr);
}