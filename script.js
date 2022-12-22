$(function () {
    ShowSplashScreen();
    SetUpEventListeners();
});

var message = document.getElementById("message");
var startMessage = "X Always Goes First!";
var turnX = true;
var over = false;
var movesLeft = 9;
var gameType = "";
var marks = ["", "", "", "", "", "", "", "", ""];
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

function ShowSplashScreen() {
    $("#splash").fadeIn(1200);
    setTimeout(function () {
        $("#splash").fadeOut(300);
        $("#menu").fadeIn(1000);
    }, 2500);
}

function SetUpEventListeners() {
    $("#menu p:not(:first-child)").click(function () {
        GameSelect(this);
    });
    $(".space.c1.r1").click(function () {
        Move(0, this);
    });
    $(".space.c2.r1").click(function () {
        Move(1, this);
    });
    $(".space.c3.r1").click(function () {
        Move(2, this);
    });
    $(".space.c1.r2").click(function () {
        Move(3, this);
    });
    $(".space.c2.r2").click(function () {
        Move(4, this);
    });
    $(".space.c3.r2").click(function () {
        Move(5, this);
    });
    $(".space.c1.r3").click(function () {
        Move(6, this);
    });
    $(".space.c2.r3").click(function () {
        Move(7, this);
    });
    $(".space.c3.r3").click(function () {
        Move(8, this);
    });
    $(".space").click(function () {
        if (gameType == "PvC" && !over && turnX === false && movesLeft > 1)
            ComputerMove();
    });
    $("#after").click(function () {
        RestartGame();
    });
}

function GameSelect(x) {
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

function WinCheck() {
    for (var i = 0; i < 8; i++) {
        if (marks[winSets[i][0]]) {
            if (
                marks[winSets[i][0]] == marks[winSets[i][1]] &&
                marks[winSets[i][1]] == marks[winSets[i][2]]
            ) {
                message.innerHTML = (turnX === true ? "X" : "O") + " Wins!";
                over = true;
                $("#after").show();
            }
        }
        if (
            !over &&
            marks[0] &&
            marks[1] &&
            marks[2] &&
            marks[3] &&
            marks[4] &&
            marks[5] &&
            marks[6] &&
            marks[7] &&
            marks[8]
        ) {
            over = true;
            message.innerHTML = "It's a Tie!";
            $("#after").show();
        }
    }
}

function Move(x, z) {
    if (!z.textContent && !over) {
        //assign mark to array
        marks[x] = turnX === true ? "X" : "O";

        if (turnX) {
            $(z).css("color", "#2E8B57");
            $(z).css("background", "#15EE16");
        } else {
            $(z).css("color", "#C92C2C");
            $(z).css("background", "#F6546A");
        }

        //assign mark to space
        z.textContent = turnX === true ? "X" : "O";

        WinCheck();

        //if the game continues
        if (!over) {
            //change letter
            turnX = !turnX;
            //change message
            message.innerHTML = (turnX === true ? "X" : "O") + "'s Turn!";
        }

        movesLeft--;
    }
}

function ComputerMove() {
    var x;
    var z = document.getElementsByClassName("space");

    //check for best move
    x = BestMove(x, z, (turnX == "X" ? "X" : "O"));
    console.log("win move", x, movesLeft);

    //if no best moves check for block move
    if (x === undefined) {
        x = BestMove(x, z, (turnX !== "X" ? "X" : "O"));
        console.log("block move", x, movesLeft);
    }

    //if no win move or block pick random move
    if (x === undefined) {
        //pick random move that's not already taken
        x = Math.floor(Math.random() * 8);

        while (marks[x] !== "") {
            x = Math.floor(Math.random() * 8);
        }
        console.log("random move", x, movesLeft);
    }//end if here

    //reassign z to correct object move
    z = z[x];

    //display animation
    $("#thinking").show();

    //after some time pick a move
    setTimeout(function () {
        $("#thinking").hide();
        Move(x, z);
    }, Math.floor(Math.random() * 1000) + 200);
}

function RestartGame() {
    if (over) {
        //reset variables
        turnX = true;
        over = false;
        marks = ["", "", "", "", "", "", "", "", ""];
        movesLeft = 9;

        //reset board
        var spaces = document.getElementsByClassName("space");

        for (var i = 0; i <= 8; i++) {
            spaces[i].textContent = "";
            spaces[i].style.backgroundColor = "#40E0D0";
        }

        message.innerHTML = startMessage;
        $("#after").hide();

        $("#board").hide(300);
        $("#menu").fadeIn(1000);
    }
}

function BestMove(x, z, y) {
    for (var i = 0; i < 8; i++) {
        if (marks[winSets[i][0]]) {
            if (
                marks[winSets[i][0]] == marks[winSets[i][1]] &&
                marks[winSets[i][1]] !== "" &&
                marks[winSets[i][2]] === "" &&
                marks[winSets[i][1]] == y
            ) {
                x = winSets[i][2];
            } else if (
                marks[winSets[i][1]] == marks[winSets[i][2]] &&
                marks[winSets[i][2]] !== "" &&
                marks[winSets[i][0]] === "" &&
                marks[winSets[i][1]] == y
            ) {
                x = winSets[i][0];
            } else if (
                marks[winSets[i][0]] == marks[winSets[i][2]] &&
                marks[winSets[i][2]] !== "" &&
                marks[winSets[i][1]] === "" &&
                marks[winSets[i][2]] == y
            ) {
                x = winSets[i][1];
            }
        }
    } console.log(y);
    return x;
}