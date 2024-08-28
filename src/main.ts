import "./styles/styles.css";

// Cell options can be 'baguette', 'bagel' or null:

type Player = "baguette" | "bagel" | null;
type GameState = Player[]; // an array of 9 elements - one for each cell

// Empty starting board
const gameState: GameState = Array(9).fill(null);

// First player to start - baguette ie. X

let currentPlayer: Player = "baguette";

function handleCellClick(event: MouseEvent) {
    const target = event.target as HTMLDivElement;
    const cellIndex = parseInt(target.id.replace("cell", "")); // Get index of cell

    // console.log(`Cell ${cellIndex} clicked`);

    if (gameState[cellIndex] !== null) {
        // console.log("Cell is already filled.");
        return; // Cell is already occupied
    }

    // Update the game state with the current player's move
    gameState[cellIndex] = currentPlayer;

    
    // Function to update board after each player's turn.
    updateBoard(); // ***Create updateBoard() function for here***


    // Check for a win or draw:

    // if (checkWinner()) { // ***Create checkWinner() function for here***
    //     alert(`${currentPlayer} wins!`);
    //     return;
    // } else if (gameState.every((cell) => cell !== null)) {
    //     alert("It's a draw!");
    //     return;
    // }

    // Switch players
    currentPlayer = currentPlayer === "bagel" ? "baguette" : "bagel";
    // console.log(`Next player is ${currentPlayer}`);
}


function updateBoard() {
    gameState.forEach((player, index) => {
        const cell = document.getElementById(`cell${index}`) as HTMLDivElement;
        if (player === 'baguette') {
            cell.style.backgroundImage = "url('./src/images/baguette.png')";
        } else if (player === 'bagel') {
            cell.style.backgroundImage = "url('./src/images/bagel.png')";
        } // else {
        //     cell.style.backgroundImage = ''; // Reset the cell if it's empty
        // }
    });
}

const cells = document.querySelectorAll('.gameboard__cell');
cells.forEach(cell => cell.addEventListener('click', handleCellClick));