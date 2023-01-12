$(function () {
    updateTopScore();
    revealSplashScreen();
    setUpEventListeners();
});

const PUBLIC_KEY = "5fa8af3feb371a09c4c51c2f";
const PRIVATE_KEY = "gIJe5J6z20ik-5Mm_NDCyAzldYBBzTmUub-VeuQrX1jw";
const USE_HTTPS = true;
const START_MESSAGE = "X Always Goes First!";
const DEFAULT_BACKGROUND_COLOR = "#40E0D0";
const X_BACKGROUND_COLOR = "#15EE16";
const X_FONT_COLOR = "#2E8B57";
const O_BACKGROUND_COLOR = "#F6546A";
const o_FONT_COLOR = "#C92C2C";
const WIN_SETS = [
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
let streak = 0;

function revealSplashScreen() {
    $("#splash").fadeIn(1200);
    setTimeout(function () {
        $("#splash").fadeOut(300);
        $("#menu").fadeIn(1000);
    }, 2500);
}

function resetBoard() {
    if (isGameOver) {
        const gameSpaces = document.getElementsByClassName("space");
        for (let i = 0; i < gameSpaces.length; i++) {
            gameSpaces[i].textContent = "";
            gameSpaces[i].style.backgroundColor = DEFAULT_BACKGROUND_COLOR;
        }
    }
    $("#boardMenu").hide();
    $("#message").innerHTML = START_MESSAGE;
    gameType = "";
    isXTurn = true;
    isGameOver = false;
    spaces = ["", "", "", "", "", "", "", "", ""];
}

function setUpEventListeners() {
    $("#playerVsCPU").click(function () {
        gameStart(this.textContent);
    });
    $("#playerVsPlayer").click(function () {
        gameStart(this.textContent);
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
    $("#playAgain").click(function () {
        gameStart(gameType);
    });

    $(".backToMenu").click(function () {
        updateCurrentStreak(0);
        showOnly("#menu");
    });

    $("#submit").click(async function () {
        const name = $("#name").val();
        if (name == "") {
            alert("Please enter a name!");
            return;
        }

        const scores = await addScoreToLeaderboard(name);
        goToLeaderboard(scores, name);

        updateTopScore();
    });
    $("#viewLeaderboard").click(async function () {
        const scores = await getScores();
        goToLeaderboard(scores);
    });
}

function gameStart(selectedGameType) {
    resetBoard();
    gameType = selectedGameType;
    showOnly("#board");
}

function checkForGameOver() {
    WIN_SETS.forEach((winSet) => {
        if (spaces[winSet[0]]
            && spaces[winSet[0]] == spaces[winSet[1]]
            && spaces[winSet[1]] == spaces[winSet[2]]) {

            $("#message").innerHTML = (isXTurn ? "X" : "O") + " Wins!";
            isGameOver = true;
            $("#boardMenu").show();

            if (gameType == "Player vs CPU") {
                if (isXTurn) {
                    $("#message").innerHTML = "You won!";
                    streak++;
                    updateCurrentStreak(streak);
                }
                else {
                    $("#message").innerHTML = "You lost :(";
                    if (streak > 0) {
                        goToNameInput();
                    } else {
                        updateCurrentStreak(0);
                    }
                }
            }
        }
        const movesLeft = spaces.filter(space => space === "").length;
        if (!isGameOver && movesLeft == 0) {
            $("#message").innerHTML = "It's a Tie!";
            isGameOver = true;
            $("#boardMenu").show();
            if (gameType == "Player vs CPU") {
                if (streak > 0) {
                    goToNameInput();
                } else {
                    updateCurrentStreak(0);
                }
            }
        }
    });
}

function playerMove(spaceIndex, htmlElement) {
    if (htmlElement.textContent) {
        return;
    }
    move(spaceIndex, htmlElement);
    if (gameType == "Player vs CPU" && !isGameOver) {
        computerMove();
    }
}

function move(spaceIndex, htmlElement) {
    if (!htmlElement.textContent && !isGameOver) {
        spaces[spaceIndex] = isXTurn ? "X" : "O";

        if (isXTurn) {
            $(htmlElement).css("color", X_FONT_COLOR);
            $(htmlElement).css("background", X_BACKGROUND_COLOR);
        } else {
            $(htmlElement).css("color", o_FONT_COLOR);
            $(htmlElement).css("background", O_BACKGROUND_COLOR);
        }

        htmlElement.textContent = isXTurn ? "X" : "O";

        checkForGameOver();

        if (!isGameOver) {
            isXTurn = !isXTurn;
            $("#message").innerHTML = (isXTurn ? "X" : "O") + "'s Turn!";
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
        } while (spaces[indexForBestMove] !== "");
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
    WIN_SETS.forEach((winSet) => {
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

function showOnly(id) {
    $("#board").hide(300);
    $("#leaderboard").hide(300);
    $("#menu").hide(300);
    $("#nameInput").hide(300);

    $(id).fadeIn(1000);
}

function updateTopScore() {
    dreamlo.initialize(PUBLIC_KEY, PRIVATE_KEY, USE_HTTPS);

    const skip = 0;
    const take = 1;
    dreamlo.getScores(dreamlo.ScoreFormat.Object, dreamlo.SortOrder.PointsDescending, skip, take)
        .then((topScore) => {
            let text = "";
            if (topScore) {
                text = topScore.score + " by " + topScore.text;
            }
            else {
                text = "No scores yet!";
            }
            $("#topScore").text("T0P: " + text);
        })
        .catch((error) => {
            alert(error);
        });
}

function goToNameInput() {
    let text = "You had a final streak of ";
    if (streak == 1) {
        text += "1 game";
    } else {
        text += streak + " games";
    }
    text += "! \n Do you want to add your name to the leaderboard?";
    $("#nameInputMessage").text(text);

    showOnly("#nameInput");
    $("#nameInput input").focus();
}

function addScoreToLeaderboard(name) {
    const timestamp = new Date().getTime();
    const score = {
        name: timestamp,
        points: streak,
        text: name
    };

    return dreamlo.addScore(score, dreamlo.ScoreFormat.Object, dreamlo.SortOrder.PointsDescending, true).then((scores) => {
        return scores;
    })
        .catch((error) => {
            alert(error);
        });
}

function getScores() {
    return dreamlo.getScores()
        .then((scores) => {
            return scores;
        })
        .catch((error) => {
            alert(error);
        });
}

function goToLeaderboard(scores, nameToHighlight) {
    $("#leaderboard tbody").empty();

    let leaderboardBody = "";
    if (scores.length == 0) {
        leaderboardBody = "<tr><td colspan='3'>No scores yet!</td></tr>";
    } else {
        for (let index = 0; index < scores.length; index++) {

            if (nameToHighlight && nameToHighlight === scores[index].text) {
                leaderboardBody += "<tr class='highlight'>";
            }
            else {
                leaderboardBody += "<tr>";
            }
            leaderboardBody += "<td>" + (index + 1) + "</td><td>" + scores[index].text + "</td><td>" + scores[index].score + "</td></tr>";
        }
    }
    $("#leaderboard tbody").append(leaderboardBody);
    showOnly("#leaderboard");
}

function updateCurrentStreak(number) {
    console.log("updateStreak:" + number);
    streak = number;
    $("#streak").text("STREAK: " + streak);
}