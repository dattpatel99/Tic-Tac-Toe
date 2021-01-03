// player turn is for first player in DP mode
var playerTurn;

// first player symbol
let playerSym = "X";
// Second player/Comp symbol
let compSym = "O";
// Holds whether the game has ended for not
var gameEnd = false;
// holds the final outcome of the match
var gameFinale;
// Used to change the modes of playing
var singlePlayer = true;

// These are used to hold the elements of grid 
topLeft = document.getElementById("topLeft");
topMiddle = document.getElementById("topMiddle");
topRight = document.getElementById("topRight");
middleLeft = document.getElementById("middleLeft");
middleMiddle = document.getElementById("middleMiddle");
middleRight = document.getElementById("middleRight");
bottomLeft = document.getElementById("bottomLeft");
bottomMiddle = document.getElementById("bottomMiddle");
bottomRight = document.getElementById("bottomRight");

// array holding each grid element starting from top left to bottom right
let arrBoxes = [topLeft, topMiddle, topRight, middleLeft, middleMiddle, middleRight, bottomLeft, bottomMiddle, bottomRight];

// what happens when the page is reloaded
window.onload = goesFirst();

// Checks the status of the element user has choosen and responds as should
function mainFunction() {
    //Gets the ID of the place that we clicked and then the element from the document
    let idTarget = document.getElementById(this.event.target.id)

    // This is to alert that game has ended and user should reload to try again
    if (gameEnd && idTarget.classList.contains("locked")) {
        alert("Game has ended. Reload to try again.");
    }

    // Alert for when player/s try to change a locked box
    else if (idTarget.classList.contains("locked")) {
        alert("A player has already choosen this box.");
    }

    // Main Checking | Used for both DP and SP
    else {
        //This basically changes the symbol in the box and then adds a lock status in the class
        idTarget.innerText = currSymbol;
        idTarget.setAttribute("style", "font-size: 35px");
        idTarget.classList.add("locked", "text-align-center");

        if (singlePlayer) {
            playerTurn = false; // Changes to comp turns

            if (checkWin(arrBoxes, playerSym)) {
                //FIXME: 
                gameFinale = "Game over. Player has won. Reload to try again."; //FIXME: change for which player won
                alert(gameFinale);
                lockAll(arrBoxes);
                // Lock all the grid places and end it somehow
                //Player won, act that way
            }

            else if (allLocked(arrBoxes)) {
                tiePrinting();
            }

            while (!playerTurn) {
                // Make comp move
                compAI(arrBoxes, playerSym, compSym);
                if (checkWin(arrBoxes, compSym)) {
                    //FIXME: 
                    gameFinale = "Game over. Player has Lost. Reload to try again";
                    alert(gameFinale);
                    lockAll(arrBoxes);
                    // Lock All the grid places and end it somehow 
                    //Player won, act that way
                }
                else if (allLocked(arrBoxes)) {
                    tiePrinting();
                }
                playerTurn = true;
                // idTarget.classList.remove("pb-5", "pt-5");
                //We may not need it at all if we do not add two people player
                //changSymbol(); 
            }
        }

        else {
            if (checkWin(arrBoxes, currSymbol)) {
                // In future if we want to allow players to choose the sybol use playerTurn variabe
                if (currSymbol === "X") {
                    gameFinale = "Game over. Player 1 has won. Reload to try again.";
                    alert(gameFinale);
                    lockAll(arrBoxes);
                }
                else if (currSymbol === "O") {
                    gameFinale = "Game over. Player 2 has won. Reload to try again.";
                    alert(gameFinale);
                    lockAll(arrBoxes);
                }
            }
            else if (allLocked(arrBoxes)) {
                tiePrinting();
            }
            changSymbol();
        }
    }
}

/**Functions */

/**
 * Full program related functions
 * changetoSP
 * changetoDP
 * changSymb
 * lockAll
 * goesFirst
 */

// Clear the board and classes
//Param:
function clearAll(grid){
    for(let i = 0; i < grid.length; i++){
        grid[i].innerText = " ";
        if(grid[i].classList.contains("locked")){
            grid[i].classList.remove("locked");
        }
    }
}

// Changes are made based on which mode player wants
// Param:
function changeModeToSP(box) {
    singlePlayer = true;
    clearAll(box);
    goesFirst();
}

// Changes are made based on which mode player wants
// Param:
function changeModeToDP(box) {
    singlePlayer = false;
    clearAll(box);
    goesFirst();
}

//Decides who goes first for SP and DP mode
function goesFirst() {
    const firstWho = Math.floor(Math.random() * 2); // Returns either 0 to 1
    if (firstWho == 1 && singlePlayer) {
        //compGoes first
        alert("Computer is going first, symbol: O");
        currSymbol = "X";
        // Allows comp to make move
        playerTurn = false;
    }
    // For second player in the event where this is being player by two people
    else if (firstWho == 1 && !singlePlayer) {
        alert("Second player is going first, symbol: O");
        currSymbol = "O";
        playerTurn = false;
    }
    else {
        // Player 1 goes first in DP mode and Player goes first in SP mode
        if (!singlePlayer) {
            alert("Player 1 is going first, symbol: X");
        }
        else {
            alert("You are going first, symbol: X");
        }
        currSymbol = "X";
        playerTurn = true;
    }
    //ADD AN AND OP SINCE IT HAS TO BE NOT PLAYERS TURN AND MODE HAS TO BE SINGLE PLAYER
    if (!playerTurn && singlePlayer) {
        compAI(arrBoxes, playerSym, compSym);
        playerTurn = true;
    }
}

// Locks all the grid boxes in the event we or comp wins when some boxes are empty
// Param: the grid <p> elements
// Return: None
function lockAll(gridLoc) {
    for (let i = 0; i < gridLoc.length; i++) {
        if (!(gridLoc[i].classList.contains("locked"))) {
            gridLoc[i].classList.add("locked");
        }
    }
    gameEnd = true;
}

// Used to change the symbol after a turn
function changSymbol() {
    // In future if we want the player to be able to switch between the different symbols use a different func to chagne player turn
    if (currSymbol == "O") {
        currSymbol = "X";
        playerTurn = true;
    }
    else {
        currSymbol = "O";
        playerTurn = false;
    }
}


/**Board checking related functions
 * checkWin
 * checkIfPossibleWin (only for when AI needs to check possible win locations)
 * allLocked
 */
// Check if anyone is winning
// Param: String l (characterSymbol)
// Return: Boolean

function checkWin(boxes, l) {

    return ((boxes[0].innerText == l && boxes[1].innerText == l && boxes[2].innerText == l) ||
        (boxes[3].innerText == l && boxes[4].innerText == l && boxes[5].innerText == l) ||
        (boxes[6].innerText == l && boxes[7].innerText == l && boxes[8].innerText == l) ||
        (boxes[0].innerText == l && boxes[3].innerText == l && boxes[6].innerText == l) ||
        (boxes[1].innerText == l && boxes[4].innerText == l && boxes[7].innerText == l) ||
        (boxes[2].innerText == l && boxes[5].innerText == l && boxes[8].innerText == l) ||
        (boxes[0].innerText == l && boxes[4].innerText == l && boxes[8].innerText == l) ||
        (boxes[2].innerText == l && boxes[4].innerText == l && boxes[6].innerText == l));
}

// Check for any locations of winning
// Param: futureGridVals, holds the array moded array to check if this will get computer/player a win
// Param: checkSymbol, the symbol for which we want to check win 
// Return: boolean, true if there is a possible win at the place
function checkIfPossibleWin(futureGridVals, checkSymbol) {
    return ((futureGridVals[0] == checkSymbol && futureGridVals[1] == checkSymbol && futureGridVals[2] == checkSymbol) ||
        (futureGridVals[3] == checkSymbol && futureGridVals[4] == checkSymbol && futureGridVals[5] == checkSymbol) ||
        (futureGridVals[6] == checkSymbol && futureGridVals[7] == checkSymbol && futureGridVals[8] == checkSymbol) ||
        (futureGridVals[0] == checkSymbol && futureGridVals[3] == checkSymbol && futureGridVals[6] == checkSymbol) ||
        (futureGridVals[1] == checkSymbol && futureGridVals[4] == checkSymbol && futureGridVals[7] == checkSymbol) ||
        (futureGridVals[2] == checkSymbol && futureGridVals[5] == checkSymbol && futureGridVals[8] == checkSymbol) ||
        (futureGridVals[0] == checkSymbol && futureGridVals[4] == checkSymbol && futureGridVals[8] == checkSymbol) ||
        (futureGridVals[2] == checkSymbol && futureGridVals[4] == checkSymbol && futureGridVals[6] == checkSymbol));
}

// Checks if all states are locked
// Param: boxes, holds array of elements from grid <p> from html file
// Return: Boolean of whether they are all locked or not
function allLocked(boxes) {
    for (let i = 0; i < boxes.length; i++) {
        if (!(boxes[i].classList.contains("locked"))) {
            return false;
        }
    }
    return true;
}

function tiePrinting() {
    gameFinale = "Game over. Game has ended in a draw. Reload to try again.";
    alert(gameFinale);
    gameEnd = true;
}

/**Compter move related functions
 * randMoveCal
 * movComp
 */
// Randomyl chooses a location for comps next move based on what is open
// Param: arr: Array of places to check
// Param: boxes: grid box
// Return: the random open location where comp can make move
function randMoveCal(arr, boxes) {
    let openPos = [];
    for (let i = 0; i < arr.length; i++) {
        if (!(boxes[arr[i]].classList.contains("locked"))) {
            openPos.push(arr[i]);
        }
    }
    let placeChoosen = Math.floor(Math.random() * openPos.length);
    return openPos[placeChoosen];
}

//Function plays the computers move
//Param: boxes, array holds the different object boxes {globally called: arrBoxes}
//Param: playSym holds the players symbol
//Param: compSym holds the computers symbol
//Return: nothing 

function compAI(boxes, playerSym, compSym) {
    //Check if there is any move where comp can win

    //FIXME: THE TINY o from tempBoxes if causing can error
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].innerText === "") {
            let tempBoxes = makeFakeBox(boxes);
            tempBoxes[i] = compSym;
            //FIXME: CHANGE FROM CHECKWIN TO SOME OTHER FUNCTION
            if (checkIfPossibleWin(tempBoxes, compSym)) {
                makeMove(boxes, i, compSym);
                return;
            }
        }
    }
    //Check if there is any move where player can win
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].innerText === "") {
            let tempBoxes = makeFakeBox(boxes);
            tempBoxes[i] = playerSym;
            //FIXME: CHANGE FROM CHECKWIN TO SOME OTHER FUNCTION
            if (checkIfPossibleWin(tempBoxes, playerSym)) {
                makeMove(boxes, i, compSym);
                return;
            }
        }
    }

    //Make random move
    let choosen = randMoveCal([0, 2, 6, 8], boxes);
    if (choosen != null) {
        makeMove(boxes, choosen, compSym);
        return;
    }
    if (!(boxes[4].classList.contains("locked"))) {
        makeMove(boxes, 4, compSym);
        return;
    }
    makeMove(boxes, randMoveCal([1, 3, 5, 7], boxes), compSym);
    return;
}

//Takes in int location of which box to make computers move in
//Param: location of box in array Boxes
//Param: grid, holds the array of boxes
//Param: holds compSymbol
//Return: nothing
function makeMove(grid, location, compSym) {
    grid[location].innerText = compSym;
    console.log("Gettign the box changes: ", grid[location]);
    grid[location].setAttribute("style", "font-size: 35px");
    grid[location].classList.add("locked", "text-align-center");

}

// Used to make a fake box because using slice was making a weird error;
// Param: boxes, the acutal grid
// Return: array holding current strings in grid
function makeFakeBox(boxes) {
    let arrayFake = []
    for (let i = 0; i < boxes.length; i++) {
        arrayFake.push(boxes[i].innerText);
    }
    return arrayFake;
}