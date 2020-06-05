// get overlays
let overlays = Array.from(document.getElementsByClassName('overlay-text'));

// hide overlay on click
overlays.forEach(overlay => {
  overlay.addEventListener('click', () => {
    overlay.classList.remove('visible');
    resetBoard();
  });
});

let cards = Array.from(document.querySelectorAll('.game-card'));

// add event listener to every card to flip on click
cards.forEach(card => {
  card.addEventListener('click', flipCard)
});

// shuffle the cards
function shuffle() {
  console.log("Shuffle cards");
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * cards.length);
    card.style.order = randomPos;
  });
};

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

// define variables for result panel
var moves = 0;
var score = 0;

var cardsWon = [];

const totalTime = 60; //Total time
var timeLeft = 60; //Time left in game
var startingTime; //To note the start of play
var timeElapsed; // To store the number of seconds since start of play

var intervalID;
// convert seconds to minutes
function convertSeconds(s) {
  var min = Math.floor(s / 60);
  var sec = s % 60;
  var minText;
  var secText;

  //Adding a little formatting (for double digit precision)
  if (min < 10) {
    minText = "0" + min
  } else {
    minText = min
  }
  if (sec < 10) {
    secText = "0" + sec
  } else {
    secText = sec
  }

  return minText + ':' + secText;
}

//timer
function runTimer() {
  console.log("Starting timer: ")
  console.log("Starting time: ", startingTime)

  //Start the timer:

  intervalID = setInterval(() => {

    //Calculating difference between starting time and current time in milliseconds
    const milliseconds = Date.now() - startingTime
    //Converting to seconds
    timeElapsed = Math.floor(milliseconds / 1000);

    timeLeft = totalTime - timeElapsed;
    document.getElementById("time-remaining").innerText = convertSeconds(timeLeft);

    if (timeLeft === 0) {
      //Exit the game etc..
      scoreDisplay();
      //Stop the setInterval function
      clearInterval(intervalID);

    }
    console.log("Time elapsed: ", timeElapsed)
  }
    , 1000);
}

// function to flip Card
function flipCard() {
  // wait while other cards finish unflipping by locking board
  if (lockBoard) return;
  // the first card can not be flipped again
  if (this === firstCard) {
    return
  } else {
    //Increment moves if it is a valid move
    moves = moves + 1;
    document.getElementById("moves").innerText = moves;
    console.log("Moves", moves);
  }

  this.classList.add('flip');

  if (!hasFlippedCard) {
    // this is the first card flipped
    hasFlippedCard = true;
    firstCard = this;

    //If first move, then start timer
    if (moves === 1) {
      startingTime = Date.now();
      runTimer();
    }

    return;
  } // else second card is flipped
  secondCard = this;

  // call function to check if a match is found
  checkForMatch();
}

// function to check for match
function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  // if it is a match disable cards so they cannot be clicked anymore, if not unflip the cards back
  isMatch ? disableCards() : unflipCards();
}

// disable cards function to remove flipping possibility 
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  cardsWon.push(firstCard, secondCard);

  //Update score here
  score = score + 1;
  document.getElementById("points").innerText = score;
  console.log("Score", score);

  if (score === 6) {
    //Disable timer
    clearInterval(intervalID);
    scoreDisplay();
  }

  resetCards();
}

// function to unflip the cards
function unflipCards() {
  lockBoard = true;
  // some time added to show the flipping 
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetCards();

    //Finish the interval
    clearInterval();
  }, 500);
}

// reset cards
function resetCards() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

//Reset board to reset timer, shuffle cards, unflip cards etc.
function resetBoard() {

  console.log("Reset board");

  //First flip, then shuffle so that player doesn't know the cards.

  // get cards
  let cards = Array.from(document.querySelectorAll('.game-card'));

  // add event listener to every card to flip on click
  cards.forEach(card => {
    //Add event listener
    card.addEventListener('click', flipCard)
    card.classList.remove("flip");
  }
  );

  shuffle();

  //reset all card variables 
  resetCards();

  //reset all score variables
  timeElapsed = 0
  timeLeft = totalTime
  score = 0;
  moves = 0;

  updateUI();

}

function updateUI() {
  document.getElementById("points").innerText = score;
  document.getElementById("moves").innerText = moves;
  document.getElementById("time-remaining").innerText = convertSeconds(timeLeft);
}
// Function for score 
function scoreDisplay() {

  //If game is won
  if (score === 6) {
    document.getElementById("victory-text").classList.add("visible");

  } else {
    //Game is lost
    document.getElementById("game-over-text").classList.add("visible");
  }

} 