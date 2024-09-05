# Tic Tac Dough

<br>

## Game Overview: Tic-Tac-Dough

-   A digital carb-themed version of the classic game Tic-Tac-Toe.
-   Two players take turns to place their symbols on a 3x3 grid.
-   Instead of the traditional "X" and "O," players use images of a **Baguette** and a **Bagel** as their symbols.
-   Objective: be the first to get three of your symbols in a row, column, or diagonal.
-   The game ends when a player wins or all the cells are filled, resulting in a draw.

<br>

## Usage

1. Clone this repository
2. Make sure you're in the correct directory < cd tic-tac-dough >
3. Run the command 'npm install' to install node packages.
4. Run 'npm install canvas-confetti' to install confetti module.
5. Run the command 'npm run dev' to start the development server on your local browser.

<br>

```bash

git clone <repository-url>

cd tic-tac-dough

npm install

npm install canvas-confetti

npm run dev

```

<br>

## Pseudocode

<br>

**Game Overview: Tic-Tac-Dough**

-   A digital carb-themed version of the classic game Tic-Tac-Toe.
-   Two players take turns to place their symbols on a 3x3 grid.
-   Instead of the traditional "X" and "O," players use images of a **Baguette** and a **Bagel** as their symbols.
-   Objective: be the first to get three of your symbols in a row, column, or diagonal.
-   The game ends when a player wins or all the cells are filled, resulting in a draw.

<br>

**Game Play:**

-   When a player clicks on an empty cell, their token (either "baguette" or "bagel") is placed in that cell.
-   After a player makes a move, it switched to the other player's turn.
-   After each move, check if the current player has won by getting three of their symbols in a row, column, or diagonal.
-   If a player wins, display a message to say which player has won and end the game.
-   If all cells are filled and no player has won, display a message to say its a draw and end the game.

<br>

**HTML & Styling:**

-   A 3x3 html grid for the game board styled to look like a classic tic-tac-toe game.
-   Each of the 9 cells of the grid are clickable and start empty. Each cell has an ID to identify its position in grid.
-   Images for "baguette" and "bagel" to represent player tokens.
-   Reset button to clear the board and start a new game.

-   Grid Layout Indexes:

    0 | 1 | 2<br>
    3 | 4 | 5 <br>
    6 | 7 | 8 <br>

<br>

**TypeScript:**

-   Define two players: Player 1 as "baguette" and Player 2 as "bagel" - Player 1 ("baguette") always starts first.
-   Start game board with all cells as empty - use an array to keep track of cell content: 'baguette', 'bagel' or empty.
-   Event listeners for each cell for player clicks.
-   Function to update the game board visually when a player makes a move.
-   Function to switch between players after each turn.
-   Function to check for a win or draw.
-   Function for reset button to reset the game.

(Changed game from 2 manual players to 1 manual player against computer)

-   Function for computer move (Player 2 - bagel)

    -   if computer has two in a row, computer will place third token for win
    -   or if human has two in a row, computer will block
    -   or if human places token in a corner; computer will place its token in the middle if empty
    -   otherwise computer to pick an empty grid cell at random

-   Winning combinations: <br>
    [0, 1, 2], horizontal <br>
    [3, 4, 5], horizontal <br>
    [6, 7, 8], horizontal <br>
    [0, 3, 6], vertical <br>
    [1, 4, 7], vertical <br>
    [2, 5, 8], vertical <br>
    [0, 4, 8], diagonal <br>
    [2, 4, 6], diagonal

<br>

**Features (in order of importance):**

1. Game Board with clickable cells to place player's token (either "baguette" or "bagel").
2. Players to be able take their turns and switching turns after each move.
3. Checks for a winner after each move and displays message if a player wins.
4. Checks for a draw if all cells are filled without a winner and displays draw message.
5. Reset button to manually reset the game when required.
6. Responsive for different screen sizes.
7. An option to play against computer.
8. Sound effects for player moves and win/draw display messages.
9. Additional styling for a bakery look.
10. Testing if time allows.
    <br>
    <br>

## Sound Attribution

**Sound Name:** [Totalwin1.wav](https://freesound.org/people/awrecording.it/sounds/547657/)<br>
**Author:** [awrecording.it](https://freesound.org/people/awrecording.it/)<br>
**License:** [Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)

**Sound Name:** [Lose_C_01](https://freesound.org/people/cabled_mess/sounds/350986/)<br>
**Author:** [cabled_mess](https://freesound.org/people/cabled_mess/)<br>
**License:** [Creative Commons 0](http://creativecommons.org/publicdomain/zero/1.0/)

**Sound Name:** [toaster oven or lift/elevator bell](https://freesound.org/people/azumarill/sounds/564623/)<br>
**Author:** [azumarill](https://freesound.org/people/azumarill/)<br>
**License:** [Attribution 3.0](http://creativecommons.org/licenses/by/3.0/)
<br>
<br>

## Image Attribution

<a href="https://www.flaticon.com/free-icons/bagel" title="bagel icons">Bagel icons created by Freepik - Flaticon</a><br>
<a href="https://www.flaticon.com/free-icons/bread" title="bread icons">Bread icons created by Freepik - Flaticon</a><br>
<a href="https://www.flaticon.com/free-icons/bakery" title="bakery icon">Bakery icon created by amonrat rungreangfangsai - Flaticon</a>
