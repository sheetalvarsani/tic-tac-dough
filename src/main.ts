import "./styles/styles.css";

// Cell options can be 'baguette', 'bagel' or null:

type Player = "baguette" | "bagel" | null;
type GameState = Player[]; // an array of 9 elements - one for each cell

// Empty starting board
const gameState: GameState = Array(9).fill(null);

// First player (baguette ie. X) always starts:

let currentPlayer: Player = "baguette";

// check if game is still being played or if winner/draw has been announced:
let isGameActive: boolean = true;

function handleCellClick(event: MouseEvent) {

    if (!isGameActive) return; // stop game if winner/draw already announced

    const target = event.target as HTMLDivElement;
    const cellIndex = parseInt(target.id.replace("cell", "")); // Get index of cell

    console.log(`Cell ${cellIndex} clicked`);

    if (gameState[cellIndex] !== null) {
        console.log("Cell is already filled.");
        return; // Cell is already occupied
    }

    // Update the game state with the current player's move
    gameState[cellIndex] = currentPlayer;

    // Function to update board after each player's turn.
    updateBoard();

    // Check for a win or draw:

    setTimeout(() => {  // timeout for board update befroe alert
        // Check for a win or draw:
        if (checkWinner()) {
            alert(`${currentPlayer} wins!`);
            console.log(`${currentPlayer} wins!`);
            isGameActive = false; // stops game
            return;
        } else if (gameState.every((cell) => cell !== null)) {
            alert("It's a draw!");
            console.log("It's a draw!");
            isGameActive = false; // stops game
            return;
        }

        // Switch players
        currentPlayer = currentPlayer === "bagel" ? "baguette" : "bagel";
        console.log(`Next player is ${currentPlayer}`);
    }, 150); 
}

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

        }
    });
}

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

const cells = document.querySelectorAll(".gameboard__cell");
cells.forEach((cell) => {
    cell.addEventListener("click", handleCellClick as EventListener);
});
