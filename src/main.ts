import "./styles/styles.css";
import confetti from "canvas-confetti";

const messageElement =
    document.querySelector<HTMLParagraphElement>("#gameMessage")!;
const cells = document.querySelectorAll<HTMLDivElement>(".gameboard__cell");
const welcomePopup = document.querySelector<HTMLDivElement>(".popup")!;
const closePopup = document.querySelector<HTMLButtonElement>(".popup__close")!;
const popupIntro = welcomePopup.querySelector<HTMLDivElement>(".popup__intro")!;
const popupResultMessage = document.querySelector<HTMLParagraphElement>(
    ".popup__result-message"
)!;
const popupResultSection =
    welcomePopup.querySelector<HTMLDivElement>(".popup__result")!;
const rulesButton = document.querySelector<HTMLButtonElement>(".btn--rules");
const resetButton = document.querySelector<HTMLButtonElement>(".btn--reset");
const startButton = document.querySelector<HTMLButtonElement>(".btn--start")!;
const againButton = document.querySelector<HTMLButtonElement>(".btn--again")!;
const closeButton = document.querySelector<HTMLButtonElement>(".btn--close")!;

const winnerSound = document.getElementById("winnerSound") as HTMLAudioElement;
const loserSound = document.getElementById("loserSound") as HTMLAudioElement;
const drawSound = document.getElementById("drawSound") as HTMLAudioElement;

// Variables:
type Player = "baguette" | "bagel" | null; // Cell options can be 'baguette', 'bagel' or null
type GameState = Player[]; // an array of 9 elements - one for each cell
const gameCell: GameState = Array(9).fill(null); // Empty starting board
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

// ***UNCOMMENT AFTER DEMO***
// const outsideCells = [0, 1, 2, 3, 5, 6, 7, 8];

// Event listener to hide results pop up on page load and show intro message before game starts:
document.addEventListener("DOMContentLoaded", () => {
    togglePopup(false);
});

// function for updating game message:
function updateGameMessage(message: string) {
    messageElement.innerHTML = message;
}

// function to switch between intro popup and results popop:
function togglePopup(showResult: boolean) {
    console.log(`Switching popup.`);
    if (showResult) {
        // Show result section && hide intro section
        popupIntro.classList.remove("--visible");
        popupResultSection.classList.add("--visible");
    } else {
        // Show intro section && hide result section
        popupIntro.classList.add("--visible");
        popupResultSection.classList.remove("--visible");
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
        gameCell[cellIndex] === null &&
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

    if (gameCell[cellIndex] !== null) {
        console.log("Cell is already filled.");
        return; // Cell is already occupied
    }

    // Update the game state with the current player's move
    gameCell[cellIndex] = currentPlayer;

    // Update board and check if there's a win/draw
    updateBoardAndCheckWinner();

    // Switch to computer's turn if the game is still active
    if (isGameActive) {
        currentPlayer = "bagel";
        updateGameMessage("🥯 Computer is making its move...");
        setTimeout(() => {
            computerMove();
        }, 1000);
    }
}

// function for computer's move (winning move, blocking move, or random cell):
function computerMove() {
    console.log("Computer's move");

    // check if computer can win:
    // For loop iterating through the possible outcomes to see if there's two bagels in a row:
    for (const [a, b, c] of winningCombinations) {
        // Check if computer has 2 tokens in a row and the third cell is empty
        if (
            gameCell[a] === "bagel" &&
            gameCell[b] === "bagel" &&
            gameCell[c] === null
        ) {
            console.log(`Computer winning at position ${c}`);
            gameCell[c] = "bagel";
            updateBoardAndCheckWinner();
            if (!isGameActive) return; // Make sure game stops if it's over
            currentPlayer = "baguette";
            updateGameMessage("🥖 It's your turn...");
            return;
        } else if (
            gameCell[a] === "bagel" &&
            gameCell[c] === "bagel" &&
            gameCell[b] === null
        ) {
            console.log(`Computer winning at position ${b}`);
            gameCell[b] = "bagel";
            updateBoardAndCheckWinner();
            if (!isGameActive) return;
            currentPlayer = "baguette";
            updateGameMessage("🥖 It's your turn...");
            return;
        } else if (
            gameCell[b] === "bagel" &&
            gameCell[c] === "bagel" &&
            gameCell[a] === null
        ) {
            console.log(`BComputer winning at position ${a}`);
            gameCell[a] = "bagel";
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
            gameCell[a] === "baguette" &&
            gameCell[b] === "baguette" &&
            gameCell[c] === null
        ) {
            console.log(`Blocking human at position ${c}`);
            gameCell[c] = "bagel";
            updateBoardAndCheckWinner();
            if (!isGameActive) return; // Make sure game stops if it's over
            currentPlayer = "baguette";
            updateGameMessage("🥖 It's your turn...");
            return;
        } else if (
            gameCell[a] === "baguette" &&
            gameCell[c] === "baguette" &&
            gameCell[b] === null
        ) {
            console.log(`Blocking human at position ${b}`);
            gameCell[b] = "bagel";
            updateBoardAndCheckWinner();
            if (!isGameActive) return;
            currentPlayer = "baguette";
            updateGameMessage("🥖 It's your turn...");
            return;
        } else if (
            gameCell[b] === "baguette" &&
            gameCell[c] === "baguette" &&
            gameCell[a] === null
        ) {
            console.log(`Blocking human at position ${a}`);
            gameCell[a] = "bagel";
            updateBoardAndCheckWinner();
            if (!isGameActive) return;
            currentPlayer = "baguette";
            updateGameMessage("🥖 It's your turn...");
            return;
        }
    }

    // check if human has placed their token in an outside cell, if so computer places in middle cell:

    // ***UNCOMMENT AFTER DEMO***
    // if (
    //     outsideCells.some((index) => gameCell[index] === "baguette") &&
    //     gameCell[4] === null // Middle is still available
    // ) {
    //     console.log("Human placed on oustide. Computer places in middle.");
    //     gameCell[4] = "bagel";
    //     updateBoardAndCheckWinner();
    //     if (!isGameActive) return;
    //     currentPlayer = "baguette";
    //     updateGameMessage("🥖 It's your turn...");
    //     return;
    // }

    // choose random ell if no winning move || no need to block || no need to counter outer move:
    console.log(
        "No winning move,no need to block, no need to counter corner, choosing random cell"
    );
    const freeCells = gameCell
        .map((cell, index) => (cell === null ? index : null))
        .filter((index) => index !== null) as number[];

    if (freeCells.length === 0) {
        console.log("No free cells");
        return;
    }

    const randomIndex = freeCells[Math.floor(Math.random() * freeCells.length)];
    console.log("Randomly chosen cell for bagel:", randomIndex);
    gameCell[randomIndex] = "bagel";

    // Update the board and check the game status
    updateBoardAndCheckWinner();
    console.log("Game state after computer move:", gameCell);

    // Switch back to human's turn if the game is still active
    if (isGameActive) {
        console.log("Switching back to human player's turn.");
        currentPlayer = "baguette";
        updateGameMessage("🥖 It's your turn...");
    }
}

// update gameboard with token depending on whose turn it is:
function updateBoard() {
    gameCell.forEach((player, index) => {
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
    for (const [a, b, c] of winningCombinations) {
        if (
            gameCell[a] !== null &&
            gameCell[a] === gameCell[b] &&
            gameCell[a] === gameCell[c]
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
                : "🥯 COMPUTER WINS! 🥯"
        }`;

        console.log(winMessage);
        updateGameMessage(winMessage);

        const popupWinMessage =
            currentPlayer === "baguette"
                ? "🥖 YOU WIN! 🥖 <br><br> Congratulations! <br>You're a RISEing star!"
                : "🥯 COMPUTER WINS! 🥯 <br><br> Oh no! You're a bit CRUSTy aren't you? Do you feel like trying again?";
        popupResultMessage.innerHTML = popupWinMessage;

        if (currentPlayer === "baguette") {
            console.log("Playing winner sound.");
            winnerSound.volume = 0.5;
            winnerSound.play();

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } else {
            console.log("Playing loser sound.");
            loserSound.play();
        }

        isGameActive = false;
        endGame();

        setTimeout(() => {
            togglePopup(true);
        }, 1000);
    } else if (gameCell.every((cell) => cell !== null)) {
        console.log("It's a DRAW!");
        const drawMessage = "It's a DRAW!";
        updateGameMessage(drawMessage);

        popupResultMessage.innerHTML = "It's a STALEmate. Well played!";

        console.log("Playing draw sound.");
        drawSound.play();

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
    gameCell.fill(null);
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

// Event listener for RULES button:
rulesButton?.addEventListener("click", () => {
    console.log("Rules popup");
    welcomePopup.style.display = "block";
    togglePopup(false);
    startButton.textContent = "CONTINUE";
});

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
    startButton.textContent = "START";
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
