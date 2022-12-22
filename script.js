$(function () {
    showSplashScreen();
    setUpEventListeners();
});

var message = document.getElementById("message");
var startMessage = "X Always Goes First!";
var isXTurn = true;
var isGameOver = false;
var movesLeft = 9;
var gameType = "";
var spaces = ["", "", "", "", "", "", "", "", ""];
var winSets = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [1, 4, 7],
    [2, 5, 8],
    [0, 3, 6],
    [0, 4, 8],
    [6, 4, 2]
];

function showSplashScreen() {
    $("#splash").fadeIn(1200);
    setTimeout(function () {
        $("#splash").fadeOut(300);
        $("#menu").fadeIn(1000);
    }, 2500);
}

function setUpEventListeners() {
    $("#menu p:not(:first-child)").click(function () {
        gameSelect(this);
    });
    $(".space.c1.r1").click(function () {
        move(0, this);
    });
    $(".space.c2.r1").click(function () {
        move(1, this);
    });
    $(".space.c3.r1").click(function () {
        move(2, this);
    });
    $(".space.c1.r2").click(function () {
        move(3, this);
    });
    $(".space.c2.r2").click(function () {
        move(4, this);
    });
    $(".space.c3.r2").click(function () {
        move(5, this);
    });
    $(".space.c1.r3").click(function () {
        move(6, this);
    });
    $(".space.c2.r3").click(function () {
        move(7, this);
    });
    $(".space.c3.r3").click(function () {
        move(8, this);
    });
    $(".space").click(function () {
        if (gameType == "PvC" && !isGameOver && !isXTurn && movesLeft > 1)
            computerMove();
    });
    $("#after").click(function () {
        restartGame();
    });
}

function gameSelect(x) {
    switch (x.textContent) {
        case "Player vs Player":
            gameType = "PvP";
            break;
        case "Player vs CPU":
            gameType = "PvC";
            break;
        case "CPU vs CPU":
            gameType = "CvC";
            break;
    }

    $("#board").fadeIn(1000);
    $("#menu").hide(300);
    message.innerHTML = startMessage;
}

function checkForWin() {
    for (var i = 0; i < winSets.length; i++) {
        if (spaces[winSets[i][0]]) {
            if (
                spaces[winSets[i][0]] == spaces[winSets[i][1]] &&
                spaces[winSets[i][1]] == spaces[winSets[i][2]]
            ) {
                message.innerHTML = (isXTurn ? "X" : "O") + " Wins!";
                isGameOver = true;
                $("#after").show();
            }
        }
        if (
            !isGameOver &&
            spaces[0] &&
            spaces[1] &&
            spaces[2] &&
            spaces[3] &&
            spaces[4] &&
            spaces[5] &&
            spaces[6] &&
            spaces[7] &&
            spaces[8]
        ) {
            isGameOver = true;
            message.innerHTML = "It's a Tie!";
            $("#after").show();
        }
    }
}

function move(spaceIndex, htmlElement) {
    if (!htmlElement.textContent && !isGameOver) {
        spaces[spaceIndex] = isXTurn ? "X" : "O";

        if (isXTurn) {
            $(htmlElement).css("color", "#2E8B57");
            $(htmlElement).css("background", "#15EE16");
        } else {
            $(htmlElement).css("color", "#C92C2C");
            $(htmlElement).css("background", "#F6546A");
        }

        //assign mark to space
        htmlElement.textContent = isXTurn ? "X" : "O";

        checkForWin();

        //if the game continues
        if (!isGameOver) {
            //change letter
            isXTurn = !isXTurn;
            //change message
            message.innerHTML = (isXTurn ? "X" : "O") + "'s Turn!";
        }

        movesLeft--;
    }
}

function computerMove() {
    var indexForBestMove;
    var gameSpaces = document.getElementsByClassName("space");

    //check for best move
    indexForBestMove = findIndexForBestMove((isXTurn == "X" ? "X" : "O"));
    console.log("win move", indexForBestMove, movesLeft);

    //if no best moves check for block move
    if (indexForBestMove === undefined) {
        indexForBestMove = findIndexForBestMove((isXTurn !== "X" ? "X" : "O"));
        console.log("block move", indexForBestMove, movesLeft);
    }

    //if no win move or block pick random move
    if (indexForBestMove === undefined) {
        //pick random move that's not already taken
        let randomSpace;
        do {
            randomSpace = Math.floor(Math.random() * (spaces.length - 1));
        } while (spaces[randomSpace] !== "")
        indexForBestMove = randomSpace;
        console.log("random move", indexForBestMove, movesLeft);
    }

    //display animation
    $("#thinking").show();

    //after some time pick a move
    setTimeout(function () {
        $("#thinking").hide();
        move(indexForBestMove, gameSpaces[indexForBestMove]);
    }, Math.floor(Math.random() * 1000) + 200);
}

function restartGame() {
    if (isGameOver) {
        //reset variables
        isXTurn = true;
        isGameOver = false;
        spaces = ["", "", "", "", "", "", "", "", ""];
        movesLeft = spaces.length;

        //reset board
        var gameSpaces = document.getElementsByClassName("space");
        for (var i = 0; i < gameSpaces.length; i++) {
            gameSpaces[i].textContent = "";
            gameSpaces[i].style.backgroundColor = "#40E0D0";
        }

        message.innerHTML = startMessage;
        $("#after").hide();

        $("#board").hide(300);
        $("#menu").fadeIn(1000);
    }
}

function findIndexForBestMove(playerMark) {
    for (var i = 0; i < winSets; i++) {
        if (spaces[winSets[i][0]]) {
            if (
                spaces[winSets[i][0]] == spaces[winSets[i][1]] &&
                spaces[winSets[i][1]] !== "" &&
                spaces[winSets[i][2]] === "" &&
                spaces[winSets[i][1]] == playerMark
            ) {
                return winSets[i][2];
            } else if (
                spaces[winSets[i][1]] == spaces[winSets[i][2]] &&
                spaces[winSets[i][2]] !== "" &&
                spaces[winSets[i][0]] === "" &&
                spaces[winSets[i][1]] == playerMark
            ) {
                return winSets[i][0];
            } else if (
                spaces[winSets[i][0]] == spaces[winSets[i][2]] &&
                spaces[winSets[i][2]] !== "" &&
                spaces[winSets[i][1]] === "" &&
                spaces[winSets[i][2]] == playerMark
            ) {
                return winSets[i][1];
            }
        }
    }
}