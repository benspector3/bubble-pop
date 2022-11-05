/* global $*/

/////////////////////////////////////////////////////////////////////////////
//////////////////////////// VARIABLES //////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

// Set window sessionStorage to keep track of high scores (lowest time)
sessionStorage.setItem("lowestTime", Infinity);
sessionStorage.setItem("lowestTimeStr", "0:00");

// DOM elements
const timer = $('#timer');
const board = $('#board');
const playButton = $('#play');

// timer variables
timer.hide();
let timeStr;
let time;

// board variables
const boardWidth = board.width();
const boardHeight = board.height();

// bubble variables
let bubblesLeft;
let bubbles;

// interval variables
let updateInterval;
let timerInterval;

// game constants
const NUM_BUBBLES = 10;
const POINTS_PER_BUBBLE = 3;
const SPEED = 10;
const ACCELERATION = 5;

alert("Pop the bubbles as fast as you can. Each bubble takes 3 taps to pop!")

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
  // Create a new array for the bubbles
  bubbles = [];

  // Create the bubble DOM elements and add them to the board
  // Add them to the array
  for (let i = 0; i < NUM_BUBBLES; i++) {
    const bubble = makeBubble(POINTS_PER_BUBBLE);
    bubbles.push(bubble);
    board.append(bubble);
  }
  
  bubblesLeft = bubbles.length;
  
  // start the timer
  timer.text("0:00");
  time = 0;
  timerInterval = setInterval(updateTimer, 1000);

  // hide the play button and show the timer
  playButton.hide();
  timer.show();
  
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
  for (let i = 0; i < bubbles.length; i++) {
    let bubble = bubbles[i];
    updateBubblePosition(bubble);
    keepInBounds(bubble);
  }
  
  if (bubblesLeft === 0) {
    endGame();
    playButton.show();
    timer.hide();
  }
}

function updateBubblePosition(bubble) {
  bubble.x += (bubble.directionX * bubble.speed);
  bubble.y += (bubble.directionY * bubble.speed);
  bubble.css('left', bubble.x);
  bubble.css('top', bubble.y);
}

function keepInBounds(bubble) {
  let xMax = boardWidth - bubble.width();
  let yMax = boardHeight - bubble.height();
  let xMin = yMin = 0;

  if (bubble.x > xMax) {
    bubble.directionX = -1;
    bubble.x = xMax;
  }
  else if (bubble.x < xMin) {
    bubble.directionX = 1;
    bubble.x = xMin;
  }

  if (bubble.y > yMax) {
    bubble.directionY = -1;
    bubble.y = yMax;
  }
  else if (bubble.y < yMin) {
    bubble.directionY = 1;
    bubble.y = yMin;
  }
}

/* Making Bubbles */
function makeBubble(pointsPerBubble) {
  // make the bubble Object
  let bubble = $('<div>')
    .addClass('bubble')
    .css('background-color', randomRGB())
    .text(pointsPerBubble);
    
  // set bubble movement properties
  bubble.x = Math.round(Math.random() * boardWidth);
  bubble.y = Math.round(Math.random() * boardHeight);
  bubble.speed = SPEED;
  bubble.directionX = Math.round(Math.random()) ? 1 : -1;
  bubble.directionY = Math.round(Math.random()) ? 1 : -1;

  // initialize bubble points total
  bubble.points = pointsPerBubble;

  // set bubble click behavior
  bubble.on('click', () => handleBubbleClick(bubble));
  bubble.on('touchstart', () => handleBubbleClick(bubble));

  return bubble;
}

/* 
 * When clicking on a bubble increase the bubble's speed,
 * decrement its point value, and if the point value hits 0 
 * remove it
 */
function handleBubbleClick(bubble) {
  bubble.speed += ACCELERATION;
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
  let r = Math.round(50 + Math.random() * 205);
  let g = Math.round(50 + Math.random() * 205);
  let b = Math.round(50 + Math.random() * 205);
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
  let secondsOnes = (time % 60) % 10;
  let secondsTens = Math.floor((time % 60) / 10);
  let minutes = Math.floor(time / 60);
  timeStr = minutes + ":" + secondsTens + secondsOnes;
  timer.text(timeStr);
}

function endGame() {
  clearInterval(updateInterval);
  clearInterval(timerInterval);
  
  let lowestTime = sessionStorage.getItem("lowestTime");
  let lowestTimeStr = sessionStorage.getItem("lowestTimeStr");
  
  if (time < lowestTime) {
    sessionStorage.setItem("lowestTime", time);
    sessionStorage.setItem("lowestTimeStr", timeStr);
    lowestTime = time;
    lowestTimeStr = timeStr;
  }
  
  alert("Game Over\nTime: " + timeStr + "\nHigh Score: " + lowestTimeStr);
}