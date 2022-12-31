$(function () {
    resetGame();
    showSplashScreen();
    setUpEventListeners();
});

const message = document.getElementById("message");
const startMessage = "X Always Goes First!";
const defaultBackgroundColor = "#40E0D0";
const xBackgroundColor = "#15EE16";
const xFontColor = "#2E8B57";
const oBackgroundColor = "#F6546A";
const oFontColor = "#C92C2C";
const winSets = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [1, 4, 7],
    [2, 5, 8],
    [0, 3, 6],
    [0, 4, 8],
    [6, 4, 2]
];

let gameType;
let isXTurn;
let isGameOver;
let spaces;

function showSplashScreen() {
    $("#splash").fadeIn(1200);
    setTimeout(function () {
        $("#splash").fadeOut(300);
        $("#menu").fadeIn(1000);
    }, 2500);
}

function resetGame() {
    if (isGameOver) {
        const gameSpaces = document.getElementsByClassName("space");
        for (let i = 0; i < gameSpaces.length; i++) {
            gameSpaces[i].textContent = "";
            gameSpaces[i].style.backgroundColor = defaultBackgroundColor;
        }

        $("#reset").hide();

        $("#board").hide(300);
        $("#menu").fadeIn(1000);
    }
    message.innerHTML = startMessage;
    gameType = "";
    isXTurn = true;
    isGameOver = false;
    spaces = ["", "", "", "", "", "", "", "", ""];
}

function setUpEventListeners() {
    $("#menu p").click(function () {
        gameSelect(this);
    });
    $(".space.c1.r1").click(function () {
        playerMove(0, this);
    });
    $(".space.c2.r1").click(function () {
        playerMove(1, this);
    });
    $(".space.c3.r1").click(function () {
        playerMove(2, this);
    });
    $(".space.c1.r2").click(function () {
        playerMove(3, this);
    });
    $(".space.c2.r2").click(function () {
        playerMove(4, this);
    });
    $(".space.c3.r2").click(function () {
        playerMove(5, this);
    });
    $(".space.c1.r3").click(function () {
        playerMove(6, this);
    });
    $(".space.c2.r3").click(function () {
        playerMove(7, this);
    });
    $(".space.c3.r3").click(function () {
        playerMove(8, this);
    });
    $("#reset").click(function () {
        resetGame();
    });
}

function gameSelect(htmlElement) {
    gameType = htmlElement.textContent;
    $("#board").fadeIn(1000);
    $("#menu").hide(300);
    message.innerHTML = startMessage;
}

function checkForGameOver() {
    winSets.forEach((winSet) => {
        if (spaces[winSet[0]]
            && spaces[winSet[0]] == spaces[winSet[1]]
            && spaces[winSet[1]] == spaces[winSet[2]]) {
            message.innerHTML = (isXTurn ? "X" : "O") + " Wins!";
            isGameOver = true;
            $("#reset").show();
        }
        const movesLeft = spaces.filter(space => space === "").length;
        if (!isGameOver && movesLeft == 0) {
            message.innerHTML = "It's a Tie!";
            isGameOver = true;
            $("#reset").show();
        }
    });
}

function playerMove(spaceIndex, htmlElement) {
    move(spaceIndex, htmlElement);
    if (gameType == "Player vs CPU" && !isGameOver) {
        computerMove();
    }
}

function move(spaceIndex, htmlElement) {
    if (!htmlElement.textContent && !isGameOver) {
        spaces[spaceIndex] = isXTurn ? "X" : "O";

        if (isXTurn) {
            $(htmlElement).css("color", xFontColor);
            $(htmlElement).css("background", xBackgroundColor);
        } else {
            $(htmlElement).css("color", oFontColor);
            $(htmlElement).css("background", oBackgroundColor);
        }

        htmlElement.textContent = isXTurn ? "X" : "O";

        checkForGameOver();

        if (!isGameOver) {
            isXTurn = !isXTurn;
            message.innerHTML = (isXTurn ? "X" : "O") + "'s Turn!";
        }
    }
}

function computerMove() {
    let indexForBestMove;

    indexForBestMove = findIndexForBestMove((isXTurn == "X" ? "X" : "O"));
    console.log("win move", indexForBestMove, spaces);

    if (indexForBestMove === undefined) {
        indexForBestMove = findIndexForBestMove((isXTurn !== "X" ? "X" : "O"));
        console.log("block move", indexForBestMove, spaces);
    }

    if (indexForBestMove === undefined) {
        do {
            indexForBestMove = Math.floor(Math.random() * (spaces.length - 1));
        } while (spaces[indexForBestMove] !== "")
        console.log("random move", indexForBestMove, spaces);
    }

    $("#thinking").show();
    setTimeout(function () {
        $("#thinking").hide();
        const gameSpaces = document.getElementsByClassName("space");
        move(indexForBestMove, gameSpaces[indexForBestMove]);
    }, Math.floor(Math.random() * 1000) + 200);
}

function findIndexForBestMove(playerMark) {
    //set index of best move to variable and return that
    //forEach's function boundary inhibits proper return statements
    let bestMove;
    winSets.forEach((winSet) => {
        if (spaces[winSet[0]] == playerMark
            && spaces[winSet[0]] == spaces[winSet[1]]
            && spaces[winSet[2]] == "") {
            bestMove = winSet[2];
        }
        else if (spaces[winSet[1]] == playerMark
            && spaces[winSet[1]] == spaces[winSet[2]]
            && spaces[winSet[0]] == "") {
            bestMove = winSet[0];
        }
        else if (spaces[winSet[2]] == playerMark
            && spaces[winSet[2]] == spaces[winSet[0]]
            && spaces[winSet[1]] == "") {
            bestMove = winSet[1];
        }
    });
    return bestMove;
}