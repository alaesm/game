import { create } from 'zustand';
import axios from 'axios';
import { devtools } from 'zustand/middleware';

const AI_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

type Player = 'X' | 'O';
type Cell = Player | null;
type Board = Cell[][];

interface GameState {
  board: Board;
  currentPlayer: Player;
  gameOver: boolean;
  winner: Player | 'Draw' | null;
  isAIBattleMode: boolean;
  battleInProgress: boolean;
  player1Moves: number[];
  player2Moves: number[];
  player1TotalTime: number;
  player1errorCount: number;
  player2TotalTime: number;
  player2errorCount: number;
  startAIBattle: (playerX: string, playerO: string) => void;
  
}

const WINNING_COMBINATIONS = [
  [[0, 0], [0, 1], [0, 2]], [[1, 0], [1, 1], [1, 2]], [[2, 0], [2, 1], [2, 2]], // Rows
  [[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]], // Columns
  [[0, 0], [1, 1], [2, 2]], [[0, 2], [1, 1], [2, 0]] // Diagonals
];

const MOVE_DELAY = 900;
const MAX_ERRORS = 3;

const emptyBoard = (): Board => Array(3).fill(null).map(() => Array(3).fill(null));

export const useGameStore = create<GameState>()(devtools((set, get) => ({
  board: emptyBoard(),
  currentPlayer: 'X',
  gameOver: false,
  winner: null,
  isAIBattleMode: true,
  battleInProgress: false,
  player1Moves: [],
  player2Moves: [],
  player1TotalTime: 0,
  player1errorCount: 0,
  player2TotalTime: 0,
  player2errorCount: 0,

  startAIBattle: async (playerX: string, playerO: string) => {
    set({
      board: emptyBoard(),
      currentPlayer: 'X',
      gameOver: false,
      winner: null,
      isAIBattleMode: true,
      battleInProgress: true,
      player1Moves: [],
      player2Moves: [],
      player1TotalTime: 0,
      player1errorCount: 0,
      player2TotalTime: 0,
      player2errorCount: 0
    });

    while (!get().gameOver) {
      const startTime = performance.now();
      let currentPlayer = get().currentPlayer;
      let errorCount = 0;
      let moveAccepted = false;
      let moveData: number[] | { row: number; col: number } | null = null;

      while (!moveAccepted && errorCount < MAX_ERRORS) {
        try {
          const { data } = await axios.post(`${AI_API_URL}/${currentPlayer === 'X' ? 'minimax1' : 'minimax2'}`, {
            board: get().board.map(row => row.map(cell => cell || '')),
            player: currentPlayer,
            playerX,  // ✅ Envoi des noms des joueurs
            playerO
          });

          if (data.action) {
            const [row, col] = data.action;
            const board = get().board;

            if (board[row][col] === null) {
              moveAccepted = true;
              moveData = { row, col };
            } else {
              errorCount += 1;
              set(state => ({
                ...state,
                [currentPlayer === 'X' ? 'player1errorCount' : 'player2errorCount']: state[currentPlayer === 'X' ? 'player1errorCount' : 'player2errorCount'] + 1
              }));
            }
          }
        } catch (error) {
          console.error('Failed to fetch AI move:', error);
          return;
        }
      }

      // ✅ Si 3 erreurs, générer un coup aléatoire
      if (!moveAccepted) {
        const emptyCells = get().board.flatMap((row, i) =>
          row.map((cell, j) => (cell === null ? [i, j] : null))
        ).filter(Boolean) as number[][];

        if (emptyCells.length > 0) {
          moveData = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
      }

      if (moveData) {
        let row: number, col: number;
        if (Array.isArray(moveData)) {
          [row, col] = moveData;
        } else {
          ({ row, col } = moveData);
        }

        const newBoard = get().board.map(row => [...row]);
        newBoard[row][col] = currentPlayer;

        let winner: Player | 'Draw' | null = null;
        let gameOver = WINNING_COMBINATIONS.some(comb => {
          const [a, b, c] = comb;
          if (newBoard[a[0]][a[1]] === currentPlayer &&
            newBoard[b[0]][b[1]] === currentPlayer &&
            newBoard[c[0]][c[1]] === currentPlayer) {
            winner = currentPlayer;
            return true;
          }
          return false;
        });

        if (!gameOver && newBoard.every(row => row.every(cell => cell !== null))) {
          winner = 'Draw';
          gameOver = true;
        }

        const moveTime = Math.round(performance.now() - startTime);

        set(state => ({
          board: newBoard,
          currentPlayer: gameOver ? currentPlayer : (currentPlayer === 'X' ? 'O' : 'X'),
          gameOver,
          winner,
          battleInProgress: !gameOver,
          player1Moves: currentPlayer === 'X' ? [...state.player1Moves, moveTime] : state.player1Moves,
          player2Moves: currentPlayer === 'O' ? [...state.player2Moves, moveTime] : state.player2Moves,
          player1TotalTime: currentPlayer === 'X' ? state.player1TotalTime + moveTime : state.player1TotalTime,
          player2TotalTime: currentPlayer === 'O' ? state.player2TotalTime + moveTime : state.player2TotalTime
        }));
      }

      await new Promise(resolve => setTimeout(resolve, MOVE_DELAY));
    }

    set({ battleInProgress: false });
  }
})));
