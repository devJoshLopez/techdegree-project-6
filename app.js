const startOverlay = document.getElementById('overlay');
const overlayTitle = document.querySelector("h2");
const qwerty = document.getElementById('qwerty');
const buttons = document.getElementsByTagName("button");
const letters = document.getElementsByClassName("letter");
const correctLetters = document.getElementsByClassName("show");
const phrase = document.getElementById('phrase');
const phraseUl = document.querySelector(`#phrase ul`);
const startGameButton = document.getElementsByClassName('btn__reset')[0];
const lives = document.getElementsByTagName("img");
const phrases = [
  "The best of both worlds",
  "Speak of the devil",
  "See eye to eye",
  "Country roads take me home",
  "Port and starboard",
  "Champion match",
  "New baby buggy",
  "Bus Route",
  "Tough Workout",
  "I got my wish"
];
var missed = 0;
var shouldReset = false;

// Used to fade out an element and then hide it from display
function fadeOutAndHide(element) {
  var op = 1.0; // initial opacity
  var timer = setInterval(function () {
    if (op <= 0.1) {
      clearInterval(timer);
      element.style.display = 'none';
    }
    element.style.opacity = op;
    op -= 0.1;
  }, 50);
}

// Used to fade in an element and remove display none
function fadeInfromHidden(element) {
  element.style.display = '';
  var op = 0.1; // initial opacity
  var timer = setInterval(function () {
    if (op >= 1) {
      clearInterval(timer);
    }
    element.style.opacity = op;
    op += 0.1;
  }, 10);
}

// Gets a random number from the amount of strings in an array and splits the string into an array of letters
function getRandomPhraseAsArray(arr) {
  //do stuff to any arr/array that is passed in 
  let randomPhrase = Math.floor(Math.random() * arr.length);
  return arr[randomPhrase].split("");
}

function addPhrasetoDisplay(arr) {
  // do stuff any arr that is passed in, and add to `#phrase ul`
  for (let i = 0; i < arr.length; i += 1) {
    const placeHolder = document.createElement("li");
    placeHolder.textContent = arr[i];
    phraseUl.appendChild(placeHolder);
    if (arr[i].match(/^[A-Za-z]+$/)) {
      placeHolder.className = "letter";
    } else {
      placeHolder.className = "space";
    }
  }
}

// The checkLetter function should get all of the elements with a class of “letter”. 
// The function should loop over the letters and check if they match the letter in the button the player has chosen.
// If there’s a match, the function should add the “show” class to the list item containing that letter, store the matching letter inside of a variable, and return that letter.
function checkLetter(btn) {
  let guessed = false;
  for (let i = 0; i < letters.length; i += 1) {
    if (btn.target.textContent === letters[i].textContent.toLowerCase()) {
      letters[i].className += " show";
      guessed = true;
    }
  }
  return guessed;
}

// checks to see if the player has won!
function checkWin() {
  if (letters.length === correctLetters.length) {
    fadeInfromHidden(startOverlay);
    startOverlay.className = "win";
    overlayTitle.innerHTML = "You did it! Im proud of you.";
    startGameButton.textContent = "Play Another Round!";
    shouldReset = true;
    console.log("Won Game");
  } else if (missed === 5) {
    fadeInfromHidden(startOverlay);
    startOverlay.className = "lose";
    overlayTitle.innerHTML = "You didn't win this time but don't give up!";
    startGameButton.textContent = "Try Again";
    shouldReset = true;
    console.log("Lost Game");
  }
}

// Resets the game if the player wants to play again
function resetGame() {
  console.log("Reset Game");
  if (shouldReset === true) {
    missed = 0;
    for (let i = 0; i < lives.length; i += 1) {
      lives[i].style.opacity = 1.0;
    }
    for (let i = 0; i < letters.length; i += 1) {
      letters[i].className = "letter";
    }
    for (let i = 0; i < buttons.length; i += 1) {
      buttons[i].className = "";
      buttons[i].disabled = false;
    }
    const li = document.querySelectorAll(".letter, .space");
    for (let i = 0; i < li.length; i += 1) {
      phraseUl.removeChild(li[i]);
    }
    const phraseArray = getRandomPhraseAsArray(phrases);
    addPhrasetoDisplay(phraseArray);
  }
}

startGameButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (startGameButton.textContent != "Start Game") {
    resetGame();
  } else {
    const phraseArray = getRandomPhraseAsArray(phrases);
    addPhrasetoDisplay(phraseArray);
    console.log("Start Game")
  }
  fadeOutAndHide(startOverlay);
})

// Use event delegation to listen only to button events from the keyboard. 
// When a player chooses a letter, add the “chosen” class to that button so the same letter can’t be chosen twice. 
// Note that button elements have an attribute you can set called “disabled” that when set to true will not respond to user clicks
qwerty.addEventListener("click", (e) => {
  const letterFound = checkLetter(e);
  if (e.target.tagName === "BUTTON") {
    e.target.className = "chosen";
    e.target.disabled = true;
    if (letterFound === false && missed < 5) {
      lives[missed].style.opacity = 0.4;
      missed++;
    }
  }
  checkWin();
});
