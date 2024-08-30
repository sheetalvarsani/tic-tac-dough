import "./styles/styles.css";

const messageElement = document.querySelector<HTMLParagraphElement>("#gameMessage");
const cells = document.querySelectorAll<HTMLDivElement>(".gameboard__cell");
const resetButton = document.querySelector<HTMLButtonElement>(".btn--reset");
const welcomePopup = document.querySelector<HTMLDivElement>(".popup")!;
const startButton = document.querySelector<HTMLButtonElement>(".btn--start")!;
const closePopup = document.querySelector<HTMLButtonElement>(".popup__close")!;


// Cell options can be 'baguette', 'bagel' or null:
type Player = "baguette" | "bagel" | null;

// an array of 9 elements - one for each cell:
type GameState = Player[];

// Empty starting board
const gameState: GameState = Array(9).fill(null);

// First player (baguette ie. X) always starts:
let currentPlayer: Player = "baguette";

// check if game is still being played or if winner/draw has been announced:
let isGameActive: boolean = true;

// function for game message:
function updateGameMessage(message: string) {
    if (messageElement) {
        messageElement.innerHTML = message;
    }
}

// start game:
updateGameMessage("LET'S PLAY! <br> Baguette 🥖 to start!");

// function for changing cell style on hover on humsan's turn:
function handleMouseOver(event: MouseEvent) {
    const target = event.target as HTMLDivElement;
    const cellIndex = parseInt(target.id.replace("cell", "")); // Get index of cell

    if (gameState[cellIndex] === null && isGameActive && currentPlayer === "baguette") {
        target.classList.add("--hover-active");
    }
}

function handleMouseOut(event: MouseEvent) {
    const target = event.target as HTMLDivElement;
    target.classList.remove("--hover-active");
}


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

    // Function to update board after each player's turn.
    updateBoard();

    // Check for a win or draw:
    if (checkWinner()) {
        updateGameMessage(`🥖 YOU WIN!`);
        console.log(`${currentPlayer} wins!`);
        isGameActive = false; // end game
        endGame(); //end-game cell colours
        return;
    } else if (gameState.every((cell) => cell !== null)) {
        updateGameMessage("It's a DRAW!");
        console.log("It's a draw!");
        isGameActive = false; // ends game
        endGame(); //end-game cell colours
        return;
    }

    // Switch to computer's turn
    currentPlayer = "bagel";
    updateGameMessage("Computer is making its move...");

    setTimeout(() => {
        computerMove();
    }, 1000);
}

// function for computer's move to choose an empty cell at random:
function computerMove() {
    const freeCells = gameState
        .map((cell, index) => (cell === null ? index : null))
        .filter((index) => index !== null) as number[];

    if (freeCells.length === 0) return;

    const randomIndex = freeCells[Math.floor(Math.random() * freeCells.length)];
    gameState[randomIndex] = "bagel";
    updateBoard();

    if (checkWinner()) {
        updateGameMessage("COMPUTER WINS!");
        isGameActive = false;
        endGame()
    } else {
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
            cell.style.backgroundImage = "url('/src/images/baguette.png')";
            cell.style.backgroundSize = "cover"; // Ensure the image covers the cell
        } else if (player === "bagel") {
            cell.style.backgroundImage = "url('/src/images/bagel.png')";
            cell.style.backgroundSize = "cover"; // Ensure the image covers the cell
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
    updateBoard();
    updateGameMessage("GAME RESET! <br> Baguette 🥖 to start!");

    cells.forEach((cell) => {
        cell.style.backgroundImage = ""; // Clear any background image
        cell.classList.remove("--end-game"); // Remove end-game class if present
        cell.classList.remove("--hover-active"); // Remove hover class if present
    });

    updateBoard();
    updateGameMessage("GAME RESET! <br> Baguette 🥖 to start!"); // Update the game message
}

// Event listener for cell click and hover:
cells.forEach((cell) => {
    cell.addEventListener("click", handleCellClick as EventListener);
    cell.addEventListener("mouseover", handleMouseOver as EventListener);
    cell.addEventListener("mouseout", handleMouseOut as EventListener);
});

// Event listener for reset button:
resetButton?.addEventListener("click", resetGame);


// Event listener for pop up:
if (welcomePopup) {
    // Show popup on page load
    window.addEventListener('load', () => {
        welcomePopup.style.display = "block";
    });

    // Close popup (x)
    closePopup.addEventListener('click', () => {
        welcomePopup.style.display = "none";
    });

    // Close poopup on "Start Game" button click:
    startButton.addEventListener('click', () => {
        welcomePopup.style.display = "none";
    });

    // Close popup when user clicks anywhere outside of the popup:
    window.addEventListener('click', (event) => {
        if (event.target === welcomePopup) {
            welcomePopup.style.display = "none";
        }
    });
}
