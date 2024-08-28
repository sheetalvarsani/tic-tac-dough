import './styles/styles.css'


// Cell options can be 'baguette', 'bagel' or null:

type Player = 'baguette' | 'bagel' | null;
type GameState = Player[]; // an array of 9 elements - one for each cell


// Initialise empty board
const gameState: GameState = Array(9).fill(null); 

// First player to start - baguette ie. X

let currentPlayer: Player = 'baguette'; 
