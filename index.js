window.onload = function () {
  const gridContainer = document.querySelector("#gridContainer");

  const ROWS = 50;
  const COLUMNS = 50;
  const FPS = 60;

  let cells = new Array(ROWS);
  window.cells = cells;

  for (let i = 0; i < cells.length; i++) {
    cells[i] = new Array(COLUMNS);
  }

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      let cell = document.createElement("div");
      cell.setAttribute("data-x", i);
      cell.setAttribute("data-y", j);
      cell.classList.add("cell");
      cell.addEventListener("click", DOMCellEvent);
      gridContainer.appendChild(cell);
      cells[i][j] = new Cell(i, j);
    }
  }

  assignNeighbours(cells);

  setInterval(updateCells, 1000 / FPS, cells);

  function DOMCellEvent(e) {
    let cellX = parseInt(e.target.dataset.x);
    let cellY = parseInt(e.target.dataset.y);

    cells[cellX][cellY].toggleAlive();
  }

  function updateCells(cells) {
    cells.forEach((row) => {
      row.forEach((cell) => {
        cell.updateNeighbours();
      });
    });

    cells.forEach((row) => {
      row.forEach((cell) => {
        cell.update();
      });
    });
  }

  function assignNeighbours(cells) {
    cells.forEach((row) => {
      row.forEach((cell) => {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            let neighbourX = cell.x + i;
            let neighbourY = cell.y + j;

            if (
              neighbourY >= 0 &&
              neighbourY < ROWS &&
              neighbourX >= 0 &&
              neighbourX < COLUMNS
            )
              if (cells[neighbourX][neighbourY] != cell)
                cell.neighbours.push(cells[neighbourX][neighbourY]);
          }
        }
      });
    });
  }
};

class Cell {
  constructor(x, y) {
    this.alive = Math.random() > 0.6;
    this.x = x;
    this.y = y;
    this.neighbours = [];
    this.neighboursAlive;

    this.DOMElement = document.querySelector(
      `[data-x="${this.x}"][data-y="${this.y}"]`
    );
    if (this.alive) this.DOMElement.classList.add("alive");
  }

  updateNeighbours() {
    this.neighboursAlive = this.neighbours.reduce(
      (prev, actual) => prev + actual.alive,
      0
    );
  }

  update() {
    if (this.alive) {
      if (this.neighboursAlive < 2 || this.neighboursAlive > 3) this.die();
    } else {
      if (this.neighboursAlive == 3) this.birth();
    }
  }

  toggleAlive() {
    if (this.alive) this.die();
    else this.birth();
  }

  birth() {
    if (this.alive == false) {
      this.alive = true;
      this.DOMElement.classList.add("alive");
    }
  }

  die() {
    if (this.alive == true) {
      this.alive = false;
      this.DOMElement.classList.remove("alive");
    }
  }
}
