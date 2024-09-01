import "./styles/styles.css";

const messageElement = document.querySelector<HTMLParagraphElement>("#gameMessage")!;
const cells = document.querySelectorAll<HTMLDivElement>(".gameboard__cell");
const welcomePopup = document.querySelector<HTMLDivElement>(".popup")!;
const closePopup = document.querySelector<HTMLButtonElement>(".popup__close")!;
const popupIntro = welcomePopup.querySelector<HTMLDivElement>(".popup__intro")!;
const popupResultMessage = document.querySelector<HTMLParagraphElement>(".popup__result-message")!;
const popupResultSection = welcomePopup.querySelector<HTMLDivElement>(".popup__result")!;
const resetButton = document.querySelector<HTMLButtonElement>(".btn--reset");
const startButton = document.querySelector<HTMLButtonElement>(".btn--start")!;
const againButton = document.querySelector<HTMLButtonElement>(".btn--again")!;
const closeButton = document.querySelector<HTMLButtonElement>(".btn--close")!;

// Variables:
type Player = "baguette" | "bagel" | null; // Cell options can be 'baguette', 'bagel' or null
type GameState = Player[]; // an array of 9 elements - one for each cell
const gameState: GameState = Array(9).fill(null); // Empty starting board
let currentPlayer: Player = "baguette"; // First player (baguette ie. X) always starts
let isGameActive: boolean = true; // check if game still going or win/draw declared

/*

Grid Layout Indexes:

0 | 1 | 2
--  --  --
3 | 4 | 5
--  --  --
6 | 7 | 8

*/

// Popup with intro message before game starts:
document.addEventListener("DOMContentLoaded", () => {
    togglePopup(false);
});

// function for updating game message:
function updateGameMessage(message: string) {
    console.log(`Game message updated: ${message}`);
    messageElement.innerHTML = message;
}

// function to switch between intro popup and results popop:
function togglePopup(showResult: boolean) {
    console.log(`Switching popup.`);
    if (showResult) {
        // Show result section && hide intro section
        popupIntro.classList.remove("--show-intro");
        popupResultSection.classList.add("--show-result");
    } else {
        // Show intro section && hide result section
        popupIntro.classList.add("--show-intro");
        popupResultSection.classList.remove("--show-result");
    }
    welcomePopup.style.display = "block"; // display popup
}

// function to display gameboard
function showGame() {
    console.log("Showing game board.");
    welcomePopup.style.display = "none";
    document.querySelector(".game")?.classList.add("game--active");
}

// start game:
updateGameMessage("🥖 Baguette to start! 🥖");

// function for changing cell style on hover on humsan's turn if cell empty:
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

// remove hover effect:
function handleMouseOut(event: MouseEvent) {
    const target = event.target as HTMLDivElement;
    target.classList.remove("--hover-active");
}

// cell click function:
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
        updateGameMessage("🥯 Computer is making its move...");
        console.log("Switching to computer's turn...");
        setTimeout(() => {
            computerMove();
        }, 1000);
    }
}



// function for computer's move (winning move, blocking move, or random cell):
function computerMove() {
    console.log("Computer's move");

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

    const cornerPairs: [number, number][] = [
        [0,8],
        [2,6],
    ]

    // check if computer can win:
    // For loop iterating through the possible outcomes to see if there's two bagels in a row:
    for (const [a, b, c] of winningCombinations) {
        // Check if computer has 2 tokens in a row and the third cell is empty
        if (
            gameState[a] === "bagel" &&
            gameState[b] === "bagel" &&
            gameState[c] === null
        ) {
            console.log(`Computer winning at position ${c}`);
            gameState[c] = "bagel";
            updateBoardAndCheckWinner();
            if (!isGameActive) return; // Make sure game stops if it's over
            currentPlayer = "baguette";
            updateGameMessage("🥖 It's your turn...");
            return;
        } else if (
            gameState[a] === "bagel" &&
            gameState[c] === "bagel" &&
            gameState[b] === null
        ) {
            console.log(`Computer winning at position ${b}`);
            gameState[b] = "bagel";
            updateBoardAndCheckWinner();
            if (!isGameActive) return; 
            currentPlayer = "baguette"; 
            updateGameMessage("🥖 It's your turn...");
            return;
        } else if (
            gameState[b] === "bagel" &&
            gameState[c] === "bagel" &&
            gameState[a] === null
        ) {
            console.log(`BComputer winning at position ${a}`);
            gameState[a] = "bagel";
            updateBoardAndCheckWinner();
            if (!isGameActive) return;
            currentPlayer = "baguette"; 
            updateGameMessage("🥖 It's your turn...");
            return;
        }
    }


    // If computer can't place a winning move, check if human has two in a row and computer should block:
    // For loop iterating through the possible outcomes to see if there's two bauette's in a row:

    for (const [a, b, c] of winningCombinations) {
        // Check if human has 2 tokens in a row and the third cell is empty
        if (
            gameState[a] === "baguette" &&
            gameState[b] === "baguette" &&
            gameState[c] === null
        ) {
            console.log(`Blocking human at position ${c}`);
            gameState[c] = "bagel";
            updateBoardAndCheckWinner();
            if (!isGameActive) return; // Make sure game stops if it's over
            currentPlayer = "baguette";
            updateGameMessage("🥖 It's your turn...");
            return;
        } else if (
            gameState[a] === "baguette" &&
            gameState[c] === "baguette" &&
            gameState[b] === null
        ) {
            console.log(`Blocking human at position ${b}`);
            gameState[b] = "bagel";
            updateBoardAndCheckWinner();
            if (!isGameActive) return; 
            currentPlayer = "baguette"; 
            updateGameMessage("🥖 It's your turn...");
            return;
        } else if (
            gameState[b] === "baguette" &&
            gameState[c] === "baguette" &&
            gameState[a] === null
        ) {
            console.log(`Blocking human at position ${a}`);
            gameState[a] = "bagel";
            updateBoardAndCheckWinner();
            if (!isGameActive) return;
            currentPlayer = "baguette"; 
            updateGameMessage("🥖 It's your turn...");
            return;
        }
    }

    // check if human has placed their token in a corner, if so computer places in opposite corner:
    for (const [corner, opposite] of cornerPairs) {
        if (gameState[corner] === "baguette" && gameState[opposite] === null) {
            console.log(`Human placed in corner ${corner}. Placing in opposite corner ${opposite}.`);
            gameState[opposite] = "bagel";
            updateBoardAndCheckWinner();
            if (!isGameActive) return; // Ensure game stops if it's over
            currentPlayer = "baguette";
            updateGameMessage("🥖 It's your turn...");
            return;
        }
    }

    // choose random ell if no winning move || no need to block || no need to counter corner move:
    console.log("No winning move and no need to block, choosing random cell");
    const freeCells = gameState
        .map((cell, index) => (cell === null ? index : null))
        .filter((index) => index !== null) as number[];

    if (freeCells.length === 0) {
        console.log("No free cells");
        return;
    }

    const randomIndex = freeCells[Math.floor(Math.random() * freeCells.length)];
    console.log("Randomly chosen cell for bagel:", randomIndex);
    gameState[randomIndex] = "bagel";

    // Update the board and check the game status
    updateBoardAndCheckWinner();
    console.log("Game state after computer move:", gameState);

    // Switch back to human's turn if the game is still active
    if (isGameActive) {
        console.log("Switching back to human player's turn.");
        currentPlayer = "baguette";
        updateGameMessage("🥖 It's your turn...");
    }
}

// update gameboard with token depending on whose turn it is:
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
    console.log("Checking for a winner");
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
            console.log(`Winner! Winning combination: [${a}, ${b}, ${c}]`);
            return true;
        }
    }
    console.log("No winner yet");
    return false;
}


// update board and check for a win/draw:
function updateBoardAndCheckWinner() {
    console.log("Updating board and checking for winner");
    updateBoard();

    if (checkWinner()) {
        const winMessage = `${
            currentPlayer === "baguette"
                ? "🥖 YOU WIN! 🥖"
                : "🥯COMPUTER WINS!🥯"
        }`;

        console.log(winMessage);
        updateGameMessage(winMessage);

        const popupWinMessage =
            currentPlayer === "baguette"
                ? "🥖 YOU WIN! 🥖 <br><br> Congratulations! <br>You're a RISEing star!"
                : "🥯COMPUTER WINS!🥯 <br><br> Oh no! You're a bit CRUSTy aren't you? Do you feel like trying again?";
        popupResultMessage.innerHTML = popupWinMessage;

        isGameActive = false;
        endGame();
       
        setTimeout(() => {
            togglePopup(true);
        }, 1000);

    } else if (gameState.every((cell) => cell !== null)) {
        console.log("It's a DRAW!");
        const drawMessage = "It's a DRAW!";
        updateGameMessage(drawMessage);

        popupResultMessage.innerHTML = "It's a STALEmate. Well played!";

        isGameActive = false;
        endGame();

        setTimeout(() => {
            togglePopup(true);
        }, 1000);
        
    }
}

// function to change cells colours when game ends.
function endGame() {
    console.log("Ending game, update board");
    cells.forEach((cell) => {
        cell.classList.add("--end-game");
        cell.removeEventListener("mouseover", handleMouseOver);
        cell.removeEventListener("mouseout", handleMouseOut);
    });
}

// function for reset button:
function resetGame() {
    console.log("Resetting game");
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
    updateGameMessage("🥖 Baguette to start! 🥖"); // Reset game message
}

// Event listener for cell click and hover:
cells.forEach((cell) => {
    cell.addEventListener("click", handleCellClick as EventListener);
    cell.addEventListener("mouseover", handleMouseOver as EventListener);
    cell.addEventListener("mouseout", handleMouseOut as EventListener);
});

// Event listener for RESET button:
resetButton?.addEventListener("click", resetGame);

// Event listener for (X) button:
closePopup.addEventListener("click", () => {
    console.log("Closing popup");
    welcomePopup.style.display = "none";
    togglePopup(false);
    showGame();
});

// Event listener for START button:
startButton.addEventListener("click", () => {
    console.log("Starting game");
    welcomePopup.style.display = "none";
    togglePopup(false);
    showGame();
});

// Event listener for PLAY AGAIN button:
againButton.addEventListener("click", () => {
    console.log("Playing again");
    welcomePopup.style.display = "none";
    togglePopup(false);
    resetGame();
    showGame();
});

// Event listener for CLOSE button:
closeButton.addEventListener("click", () => {
    welcomePopup.style.display = "none";
});

// Event listener for closing popup by clicking outside of it:
window.addEventListener("click", (event) => {
    if (event.target === welcomePopup) {
        welcomePopup.style.display = "none";
        togglePopup(false);
        showGame();
    }
});
