class Sudoku {
  constructor() {
    this.canvas = document.getElementById("sudokuCanvas");
    this.pleaseWait = document.getElementById("pleaseWait");
    this.solutionFound = document.getElementById("solutionFound");

    this.sudokuCanvasSize = 400;
    this.nbrBoxes = 9;
    this.boxSize = this.sudokuCanvasSize / this.nbrBoxes;

    this.context = this.canvas.getContext("2d");
    this.canvas.width = this.sudokuCanvasSize;
    this.canvas.height = this.sudokuCanvasSize;

    this.sudokuProblem = [[]];

  }

  init() {
    this.#initSudokuProblem();
    this.#solveSudoku(); 
  }

  async #solveSudoku() {
    const emptyCell = this.#findEmptyCell();
    if (!emptyCell) {  
      this.pleaseWait.style.display="none";
      this.solutionFound.style.display="block";
      return true;
    }

    const [row, col] = emptyCell;

    for (let num = 1; num <= 9; num++) {
      if (this.#isValidMove(row, col, num)) {
        this.#highlightSquare(row,col,num,'green');
        this.sudokuProblem[row][col] = num;
 
         // Delay execution for visualization
         await new Promise(
          (resolve) => setTimeout(resolve, 1));

        if (await this.#solveSudoku()) {
          return true; // Found a solution
        }

        // Backtrack if the current number doesn't lead to a solution 
        this.#highlightSquare(row,col, 0);
        this.sudokuProblem[row][col] = 0;

        // Delay execution for visualization
        await new Promise(
          (resolve) => setTimeout(resolve, 1));
      }
    }
    
    return false; // No solution found
  }
  
  #isValidMove(row, col, num) {
    return (
      !this.#isNumberInRow(row, num) &&
      !this.#isNumberInColumn(col, num) &&
      !this.#isNumberInGrid(row - (row % 3), col - (col % 3), num)
    );
  }

  #isNumberInRow(row, num) {
    for (let col = 0; col < 9; col++) {
      if (this.sudokuProblem[row][col] === num) {
        return true;
      }
    }
    return false;
  }

  #isNumberInColumn(col, num) {
    for (let row = 0; row < 9; row++) {
      if (this.sudokuProblem[row][col] === num) {
        return true;
      }
    }
    return false;
  }

  #isNumberInGrid(startRow, startCol, num) {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.sudokuProblem[startRow + row][startCol + col] === num) {
          return true;
        }
      }
    }
    return false;
  }

  #findEmptyCell() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.sudokuProblem[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null; // No empty cells left
  }

  #drawGrid() {
    this.context.clearRect(0, 0, this.sudokuCanvasSize, this.sudokuCanvasSize);
    this.context.beginPath();
    //draw rows
    for (let i = 0; i <= this.nbrBoxes; i++) {
      const pos = i * this.boxSize;
      this.context.moveTo(0, pos);
      this.context.lineTo(this.sudokuCanvasSize, pos);
    }
    this.context.lineWidth = 1;
    this.context.strokeStyle = "black";
    this.context.stroke();

    //draw cols
    for (let i = 0; i <= this.nbrBoxes; i++) {
      const pos = i * this.boxSize;
      this.context.moveTo(pos, 0);
      this.context.lineTo(pos, this.sudokuCanvasSize);
    }
    this.context.stroke();
  }

  #initSudokuProblem() {
    this.sudokuProblem = [
      [6, 3, 0, 0, 0, 0, 0, 4, 0],
      [8, 0, 2, 0, 0, 0, 1, 0, 5],
      [0, 5, 0, 9, 0, 0, 0, 0, 0],
      [0, 6, 7, 4, 0, 0, 3, 0, 9],
      [0, 0, 1, 0, 0, 0, 0, 5, 2],
      [0, 0, 0, 0, 0, 0, 4, 7, 0],
      [0, 0, 0, 0, 0, 0, 0, 3, 0],
      [3, 1, 0, 0, 8, 5, 0, 0, 0],
      [2, 0, 0, 0, 0, 9, 0, 0, 0]
    ];
    this.#drawGrid();
    this.#drawNumbers();
  }

  #drawNumbers() {
    this.context.font = "24px serif";
    for (let row = 0; row < this.nbrBoxes; row++) {
      for (let column = 0; column < this.nbrBoxes; column++) {
        this.context.fillText(
          this.sudokuProblem[row][column],
          column * this.boxSize + (this.boxSize / 2 - 8),
          (row + 1) * this.boxSize - (this.boxSize / 2 - 8)
        );
      }
    }
  }

  #highlightSquare(row, col,num, color='red') {
    this.context.clearRect(
      col * this.boxSize,
      row * this.boxSize,
      this.boxSize,
      this.boxSize
    );
    this.context.fillStyle = color;
    this.context.globalAlpha = 0.4;
    this.context.fillRect(
      col * this.boxSize,
      row * this.boxSize,
      this.boxSize,
      this.boxSize
    );
    this.context.fillStyle = "black";
    this.context.globalAlpha = 1.0;
    this.context.fillText(
     num,
     col * this.boxSize + (this.boxSize / 2 - 8),
     (row + 1) * this.boxSize - (this.boxSize / 2 - 8)
    );
  }
}
