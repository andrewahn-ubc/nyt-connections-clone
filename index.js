window.onload = function() {
    initialize();
}

let height = 4;
let width = 4;


let purpleGroup = ["GF", "PAD", "LUCK", "TRAP"];
let blueGroup = ["WORM", "MERMAID", "ALICE", "PANDA"];
let greenGroup = ["SUPERSTAR", "KYKY", "GIRL", "BABY"];
let yellowGroup = ["FLOAT", "DENNY", "LANGULY", "POCKY"];

let wordlist = purpleGroup.concat(blueGroup, greenGroup, yellowGroup);

let allGroups = [purpleGroup, blueGroup, greenGroup, yellowGroup];
let clickedSoFar = [];
let mistakesRemaining = 4;
let correctSoFar = 0;
let allTiles = [];

function initialize() {
    // Create the board
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = wordlist[r*4 + c];
            tile.classList.add("tile-not-clicked");
            tile.innerText = wordlist[r*4 + c];
            document.getElementById("board").appendChild(tile);
            allTiles.push(tile);
            tile.addEventListener("click", clickHappened);
        }
    }

    shuffle();

    let shuffleButton = document.createElement("span");
    shuffleButton.id = "shuffle";
    shuffleButton.classList.add("button-not-clicked");
    shuffleButton.innerText = "Shuffle";
    document.getElementById("button-panel").appendChild(shuffleButton);
    shuffleButton.addEventListener("click", shuffle);

    let deselectButton = document.createElement("span");
    deselectButton.id = "deselect";
    deselectButton.classList.add("button-not-clicked");
    deselectButton.innerText = "Deselect All";
    document.getElementById("button-panel").appendChild(deselectButton);
    deselectButton.addEventListener("click", deselect);

    let submitButton = document.createElement("span");
    submitButton.id = "submit";
    submitButton.classList.add("button-not-clicked");
    submitButton.innerText = "Submit";
    document.getElementById("button-panel").appendChild(submitButton);
    submitButton.addEventListener("click", checkSolution);

    let mistakes = document.createElement("span");
    mistakes.id = "mistakes";
    mistakes.classList.add("mistakes");
    mistakes.innerText = "Mistakes remaining: " + mistakesRemaining.toString();
    document.getElementById("mistakes-panel").appendChild(mistakes);
}

function deselect() {
    if (clickedSoFar.length == 4) {
        document.getElementById("submit").classList.replace("button-clicked", "button-not-clicked");
    }
    
    for (let w = 0; w < clickedSoFar.length; w++) {
        document.getElementById(clickedSoFar[w]).classList.replace("tile-clicked", "tile-not-clicked");
    }

    clickedSoFar = [];
}

function shuffle() {
    // TODO: remove all children from board
    const board = document.getElementById("board");
    while(board.firstChild) {
        board.removeChild(board.lastChild);
    }

    let allTilesCopy = allTiles;
    let newAllTiles = [];

    for (let n = 0; n < 16; n++) {
        let currTile = allTilesCopy[Math.floor(allTilesCopy.length*Math.random())];
        document.getElementById("board").appendChild(currTile);
        newAllTiles.push(currTile);
        allTilesCopy.splice(allTilesCopy.indexOf(currTile), 1);
    }

    allTiles = newAllTiles;
}

function clickHappened() {
    if (this.classList.contains("tile-not-clicked")) {
        if (clickedSoFar.length >= 4) return;

        clickedSoFar.push(this.innerText);
        this.classList.replace("tile-not-clicked", "tile-clicked");

        if (clickedSoFar.length == 4) {
            // set submit button black
            document.getElementById("submit").classList.replace("button-not-clicked", "button-clicked");
        }
    } else if (this.classList.contains("tile-clicked")) {
        let i = clickedSoFar.indexOf(this.innerText);
        clickedSoFar.splice(i, 1);
        this.classList.replace("tile-clicked", "tile-not-clicked");
        if (clickedSoFar.length == 3) {
            document.getElementById("submit").classList.replace("button-clicked", "button-not-clicked");
        }
    }
}

function checkSolution() {
    // set submit button to original
    if (mistakesRemaining == 0) return;
    document.getElementById("submit").classList.replace("button-clicked", "button-not-clicked");

    if (clickedSoFar.length > 4 || clickedSoFar.length < 4) return;

    for (let i = 0; i < allGroups.length; i++) {
        let currGroup = allGroups[i];
        let correct = true;

        for (let w = 0; w < currGroup.length; w++) {
            if (!clickedSoFar.includes(currGroup[w])) {
                correct = false;
            }
        }

        let colourList = ["purple-group", "green-group", "blue-group", "yellow-group"];

        if (correct) {
            // this group was guessed!
            for (let l = 0; l < clickedSoFar.length; l++) {
                let tile = document.getElementById(clickedSoFar[l]);
                tile.classList.replace("tile-clicked", colourList[i]);
            }

            clickedSoFar = [];
            correctSoFar++;

            if (correctSoFar == 4) {
                document.getElementById("result").innerText = "You are a genius!!! Happy Birthday my love :)";
            }

            return;
        }
    }

    mistakesRemaining--;
    document.getElementById("mistakes").innerText = "Mistakes remaining: " + mistakesRemaining.toString();

    if (mistakesRemaining == 0) {
        document.getElementById("result").innerText = "Game over :( You're still smart and awesome tho";
    }
}


