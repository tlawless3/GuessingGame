function Game(){
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
  return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
  if(this.playersGuess - this.winningNumber < 0){
    return true;
  }
  return false;
}

Game.prototype.playersGuessSubmission = function(num){
  if(num < 1 || num > 100 || typeof num !== "number"){
    throw "That is an invalid guess.";
  }
  this.playersGuess = num;
  return this.checkGuess();
}

Game.prototype.checkGuess = function() {
    if(this.playersGuess===this.winningNumber) {
        $('#hint, #submit').prop("disabled",true);
        $('#subtitle').text("Press the Reset button to play again!")
        return 'You Win!'
    }
    else {
        if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
            return 'You have already guessed that number.';
        }
        else {
            this.pastGuesses.push(this.playersGuess);
            $('#guessList li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
            if(this.pastGuesses.length === 5) {
                $('#hint, #submit').prop("disabled",true);
                $('#subtitle').text("Press the Reset button to play again!")
                return 'You Lose.';
            }
            else {
                var diff = this.difference();
                if(this.isLower()) {
                    $('#subtitle').text("Guess Higher!")
                } else {
                    $('#subtitle').text("Guess Lower!")
                }
                if(diff < 10) return'You\'re burning up!';
                else if(diff < 25) return'You\'re lukewarm.';
                else if(diff < 50) return'You\'re a bit chilly.';
                else return'You\'re ice cold!';
            }
        }
    }
}

Game.prototype.provideHint = function(){
  var resultArr = [];
  resultArr.push(this.winningNumber);
  for(var i = 0; i < 2; i++){
    resultArr.push(generateWinningNumber());
  }
  return shuffle(resultArr);
}

function newGame(){
  return new Game();
}

function generateWinningNumber(){
  return Math.floor(Math.random() * 100) + 1;
}

function shuffle(arr){
  var m = arr.length, t, i;

  while(m){
    i = Math.floor(Math.random() * m--);

    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }

  return arr;
}

function makeAGuess(game){
  var guess = $("#playerInput").val();
  $("#playerInput").val("");
  var output = game.playersGuessSubmission(parseInt(guess, 10));
  $("#title").text(output);
}

$(document).ready(function(){
  var game = new Game();

  $("#submitButton").click(function(){
    makeAGuess(game);
  });

  $("#playerInput").keypress(function(){
    if(event.which === 13){
      makeAGuess(game);
    }
  });

  $('#hintButton').click(function() {
    var hints = game.provideHint();
    $('#title').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
  });

  $('#resetButton').click(function() {
    game = newGame();
    $('#title').text('Play the Guessing Game!');
    $('#subtitle').text('Guess a number between 1-100!')
    $('.guess').text('-');
    $('#hint, #submit').prop("disabled",false);
  });
});
