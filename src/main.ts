import "./styles/styles.css";

const messageElement = document.querySelector<HTMLParagraphElement>("#gameMessage")!;
const cells = document.querySelectorAll<HTMLDivElement>(".gameboard__cell");
const resetButton = document.querySelector<HTMLButtonElement>(".btn--reset");
const welcomePopup = document.querySelector<HTMLDivElement>(".popup")!;
const startButton = document.querySelector<HTMLButtonElement>(".btn--start")!;
const closePopup = document.querySelector<HTMLButtonElement>(".popup__close")!;
const popupIntro = welcomePopup.querySelector<HTMLDivElement>(".popup__intro")!;
const popupResultMessage = document.querySelector<HTMLParagraphElement>(".popup__result-message")!;

const popupResultSection = welcomePopup.querySelector<HTMLDivElement>(".popup__result")!;

// Variables:
type Player = "baguette" | "bagel" | null; // Cell options can be 'baguette', 'bagel' or null
type GameState = Player[]; // an array of 9 elements - one for each cell
const gameState: GameState = Array(9).fill(null); // Empty starting board
let currentPlayer: Player = "baguette"; // First player (baguette ie. X) always starts
let isGameActive: boolean = true; // check if game still going or win/draw declared


document.addEventListener("DOMContentLoaded", () => {
    // Set initial state of popup
    togglePopup(false); // Start with intro visible
});

// function for game message:
function updateGameMessage(message: string) {
    messageElement.innerHTML = message;
}

function togglePopup(showResult: boolean) {
    popupIntro.classList.toggle("--show-intro", !showResult);
    popupResultSection.classList.toggle("--show-result", showResult);
    welcomePopup.style.display = "block";
}

// Function to handle popup close on (x) and start button
function closePopupHandler() {
    welcomePopup.style.display = "none";
    togglePopup(false);
    // showGame(); need?!
}

function showGame() {
    welcomePopup.style.display = "none";
    document.querySelector(".game")?.classList.add("game--active");
}

// Event listeners for closing the popup
closePopup.addEventListener("click", closePopupHandler);
startButton.addEventListener("click", () => {
    closePopupHandler();
    showGame();
});

// Close popup when user clicks anywhere outside of the popup content
window.addEventListener("click", (event) => {
    if (event.target === welcomePopup) {
        closePopupHandler();
    }
});

// start game:
updateGameMessage("LET'S PLAY! <br> Baguette 🥖 to start!");

//---------------
// function for changing cell style on hover on humsan's turn:
function handleMouseOver(event: MouseEvent) {
    const target = event.target as HTMLDivElement;
    const cellIndex = parseInt(target.id.replace("cell", "")); // Get index of cell

    if (
        gameState[cellIndex] === null &&
        isGameActive &&
        currentPlayer === "baguette"
    ) {
        target.classList.add("--hover-active");
    }
}



function handleMouseOut(event: MouseEvent) {
    const target = event.target as HTMLDivElement;
    target.classList.remove("--hover-active");
}


//-----------------




function handleCellClick(event: MouseEvent) {
    // stop clicking if winner/draw already announced or when computer's turn
    if (!isGameActive || currentPlayer !== "baguette") return;

    const target = event.target as HTMLDivElement;
    const cellIndex = parseInt(target.id.replace("cell", "")); // Get index of cell

    if (gameState[cellIndex] !== null) {
        console.log("Cell is already filled.");
        return; // Cell is already occupied
    }

    // Update the game state with the current player's move
    gameState[cellIndex] = currentPlayer;

    // Update board and check if there's a win/draw
    updateBoardAndCheckWinner();

    // Switch to computer's turn if the game is still active
    if (isGameActive) {
        currentPlayer = "bagel";
        updateGameMessage("Computer is making its move...");

        setTimeout(() => {
            computerMove();
        }, 1000);
    }
}

function computerMove() {
    const freeCells = gameState
        .map((cell, index) => (cell === null ? index : null))
        .filter((index) => index !== null) as number[];

    if (freeCells.length === 0) return;

    const randomIndex = freeCells[Math.floor(Math.random() * freeCells.length)];
    gameState[randomIndex] = "bagel";

    // Update the board and check the game status
    updateBoardAndCheckWinner();

    // Switch back to human's turn if the game is still active
    if (isGameActive) {
        currentPlayer = "baguette";
        updateGameMessage("It's your turn...");
    }
}

// update token depending on whose turn it is:
function updateBoard() {
    gameState.forEach((player, index) => {
        const cell = document.getElementById(`cell${index}`) as HTMLDivElement;
        if (!cell) {
            console.error(`No cell found with ID cell${index}`);
            return;
        }

        if (player === "baguette") {
            cell.style.backgroundImage = "url('./images/baguette.png')";
            cell.style.backgroundSize = "cover";
        } else if (player === "bagel") {
            cell.style.backgroundImage = "url('./images/bagel.png')";
            cell.style.backgroundSize = "cover";
        } else {
            // for resetting the game
            cell.style.backgroundImage = "";
        }
        // remove end-game cell colours
        if (isGameActive) {
            cell.classList.remove("--end-game");
        }
    });
}

// check for winning combos:
function checkWinner(): boolean {
    const winningCombinations: [number, number, number][] = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const [a, b, c] of winningCombinations) {
        if (
            gameState[a] !== null &&
            gameState[a] === gameState[b] &&
            gameState[a] === gameState[c]
        ) {
            // checking if value in each cell (ie bagel or baguette) is the same
            return true;
        }
    }
    return false;
}

// update board and check for a win/draw:
function updateBoardAndCheckWinner() {
    updateBoard();

    if (checkWinner()) {
        const winMessage = `${currentPlayer === "baguette" ? "🥖 YOU WIN!" : "COMPUTER WINS!"}`;
        updateGameMessage(winMessage);
        isGameActive = false;
        endGame();
        popupResultMessage.innerHTML = winMessage;
        togglePopup(true);
    } else if (gameState.every((cell) => cell !== null)) {
        const drawMessage = "It's a DRAW!";
        updateGameMessage(drawMessage);
        isGameActive = false;
        endGame();
        popupResultMessage.innerHTML = drawMessage;
        togglePopup(true);
    }
}

// function to change cells colours when game ends.
function endGame() {
    cells.forEach((cell) => {
        cell.classList.add("--end-game");
        cell.removeEventListener("mouseover", handleMouseOver);
        cell.removeEventListener("mouseout", handleMouseOut);
    });
}

// function for reset button:
function resetGame() {
    gameState.fill(null);
    currentPlayer = "baguette";
    isGameActive = true;

    cells.forEach((cell) => {
        cell.style.backgroundImage = "";
        cell.classList.remove("--end-game", "--hover-active");

        // Re-add the hover event listeners
        cell.addEventListener("mouseover", handleMouseOver as EventListener);
        cell.addEventListener("mouseout", handleMouseOut as EventListener);
    });

    updateBoard();
    updateGameMessage("GAME RESET! <br> Baguette 🥖 to start!"); // Reset game message
}

// Event listener for cell click and hover:
cells.forEach((cell) => {
    cell.addEventListener("click", handleCellClick as EventListener);
    cell.addEventListener("mouseover", handleMouseOver as EventListener);
    cell.addEventListener("mouseout", handleMouseOut as EventListener);
});

// Event listener for reset button:
resetButton?.addEventListener("click", resetGame);
closePopup.addEventListener("click", () => {
    welcomePopup.style.display = "none";
    togglePopup(false);
    showGame();
});

startButton.addEventListener("click", () => {
    welcomePopup.style.display = "none";
    togglePopup(false);
    showGame();
});

// Event listener for pop up:
window.addEventListener("click", (event) => {
    if (event.target === welcomePopup) {
        welcomePopup.style.display = "none";
        togglePopup(false);
        showGame();
    }
});
