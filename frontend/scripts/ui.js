class UI {
    constructor() {
        this.showScores = true;
        this.showPercentages = false;
        this.targetRow = 0;
        this.targetCol = 0;
        this.targetCoord = "A1";
        this.targetValue = 0;
    }

    showUI() {
        this.showInfo();
        this.showBoard();
        this.showFleet();
    }

    showInfo() {
        let infoOutput = `
            <div class="container-card left-card">
                <h3>Info</h3>

                <input type="radio" id="scores" name="toggle-info" class="toggle-info" value="scores" ${this.showScores ? "checked" : ""}>
                <label for="scores">Scores</label>
                <input type="radio" id="percentages" name="toggle-info" class="toggle-info" value="percentages" ${this.showPercentages ? "checked" : ""}>
                <label for="percentages">Percentages</label>
                <input type="radio" id="none" name="toggle-info" class="toggle-info" value="none" ${!this.showScores && !this.showPercentages ? "checked" : ""}>
                <label for="none">None</label>
                <button id="reset">Reset Board</button><br>

                <p id="best-coord">Best Square: ${solver.bestCell.position}</p>
                ${solver.errors != null ? `<p id="errors">${solver.errors.join("<br>")}</p>` : ""}
            </div>
        `;
        document.getElementById("info").innerHTML = infoOutput;
    }

    showBoard() {
        let boardOutput = `
            <div class="border-cell"></div>
            <div class="border-cell"><span class="label">1</span></div>
            <div class="border-cell"><span class="label">2</span></div>
            <div class="border-cell"><span class="label">3</span></div>
            <div class="border-cell"><span class="label">4</span></div>
            <div class="border-cell"><span class="label">5</span></div>
            <div class="border-cell"><span class="label">6</span></div>
            <div class="border-cell"><span class="label">7</span></div>
            <div class="border-cell"><span class="label">8</span></div>
            <div class="border-cell"><span class="label">9</span></div>
            <div class="border-cell"><span class="label">10</span></div>
        `;

        for (let row = 0; row < solver.probabilities.length; row++) {
            let letter = String.fromCharCode(65 + row)

            boardOutput += `
                <div class="border-cell">
                    <span class="label">${letter}</span>
                </div>
            `;
            for (let col = 0; col < solver.probabilities[row].length; col++) {
                let score = solver.probabilities[row][col].score
                let boardVal = solver.board[row][col];
                let color = score > 0 ? this.#getColor(score) : "#F5F5F5"

                if (boardVal == 0) {
                    boardOutput += `
                        <div class="cell" data-row="${row}" data-col="${col}" data-coord="${letter}${col + 1}" style="background:${color};">
                            <svg class="evaluate miss" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <circle class="evaluate miss" cx="12" cy="12" r="10" fill="currentColor"/>
                            </svg>
                            <span class="evaluate">
                            </span>
                        </div>
                    `;
                } else if (boardVal == 6) {
                    boardOutput += `
                        <div class="cell" data-row="${row}" data-col="${col}" data-coord="${letter}${col + 1}" style="background:${color};">
                            <svg class="evaluate hit" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <circle class="evaluate hit" cx="12" cy="12" r="10" fill="currentColor"/>
                            </svg>
                            <span class="evaluate">
                            </span>
                        </div>
                    `;
                } else if (boardVal > 0) {
                    boardOutput += `
                        <div class="cell" data-row="${row}" data-col="${col}" data-coord="${letter}${col + 1}" style="background:${color};">
                            <svg class="evaluate sunk" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path class="evaluate sunk"fill="currentColor" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 7a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3Z"/>
                            </svg>
                            <span class="evaluate">
                            </span>
                        </div>
                    `;
                } else if (row == solver.bestCell.coordinates[0] && col == solver.bestCell.coordinates[1]) {
                    boardOutput += `
                        <div class="cell" data-row="${row}" data-col="${col}" data-coord="${letter}${col + 1}" style="background:${color};">
                            <svg class="evaluate target" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path class="evaluate target" fill="currentColor" d="M3.05 13H1v-2h2.05C3.5 6.83 6.83 3.5 11 3.05V1h2v2.05c4.17.45 7.5 3.78 7.95 7.95H23v2h-2.05c-.45 4.17-3.78 7.5-7.95 7.95V23h-2v-2.05C6.83 20.5 3.5 17.17 3.05 13M12 5a7 7 0 0 0-7 7a7 7 0 0 0 7 7a7 7 0 0 0 7-7a7 7 0 0 0-7-7Z"/>
                            </svg>
                            <span class="evaluate best-cell">
                                ${this.getDisplayValue(row, col)}
                            </span>
                        </div>
                    `;
                } else {
                    boardOutput += `
                        <div class="cell" data-row="${row}" data-col="${col}" data-coord="${letter}${col + 1}" style="background:${color};">
                            <span class="evaluate">
                                ${this.getDisplayValue(row, col)}
                            </span>
                        </div>
                    `;
                }
            }
        }
        document.getElementById("gameboard").innerHTML = boardOutput;
    }

    showOverlay() {
        let overlayOutput = `
            <div class="card">
                <span id="close">&times;</span>
                <div class="inner-card">
                    <h3>${this.targetCoord}</h3>
                    <button class="modal-btn" id="miss">Miss</button>
                    <button class="modal-btn" id="hit">Hit</button>
                    <button class="modal-btn" id="sunk">Sunk</button>
                    ${this.targetValue != -1 ? `<button class="modal-btn" id="clear">Clear Square</button>` : ""}
                    <div id="target-ships">
                    </div>
                </div>
            </div>
            `;
        document.getElementById("gameboard-overlay").innerHTML = overlayOutput;
        document.getElementById("gameboard-overlay").style.display = "flex";
    }

    hideOverlay() {
        document.getElementById("target-ships").style.display = "none";
        document.getElementById("gameboard-overlay").style.display = "none";
    }

    showTargetShips() {
        let targetShipsOutput = ""

        for (let i = 0; i < solver.fleet.length; i++) {
            targetShipsOutput += `<button class="modal-btn sink-ship" value="${solver.fleet[i].name}">${solver.fleet[i].name}</button>`
        }

        document.getElementById("target-ships").innerHTML = targetShipsOutput;
        document.getElementById("target-ships").style.display = "block";
    }

    showLoading() {
        let loadingOutput = `
        <div class="loading">
            <span class="wheel"></span>
        </div>
        `;
        document.getElementById("gameboard-load").innerHTML = loadingOutput;
        document.getElementById("gameboard-load").style.display = "flex";
    }

    hideLoading() {
        document.getElementById("gameboard-load").style.display = "none";
    }

    showFleet() {
        let fleetOutput = `
            <div class="container-card right-card">
                <h3>Fleet</h3>
                <input type="checkbox" id="carrier" name="toggle-ship" class="toggle-ship" value="carrier" ${solver.fleet.find(ship => ship.name == "carrier") ? "checked" : ""}>
                <label for="carrier">Carrier</label>
                <input type="checkbox" id="battleship" name="toggle-ship" class="toggle-ship" value="battleship" ${solver.fleet.find(ship => ship.name == "battleship") ? "checked" : ""}>
                <label for="battleship">Battleship</label>
                <input type="checkbox" id="submarine" name="toggle-ship" class="toggle-ship" value="submarine" ${solver.fleet.find(ship => ship.name == "submarine") ? "checked" : ""}>
                <label for="submarine">Submarine</label>
                <input type="checkbox" id="cruiser" name="toggle-ship" class="toggle-ship" value="cruiser" ${solver.fleet.find(ship => ship.name == "cruiser") ? "checked" : ""}>
                <label for="cruiser">Cruiser</label>
                <input type="checkbox" id="destroyer" name="toggle-ship" class="toggle-ship" value="destroyer" ${solver.fleet.find(ship => ship.name == "destroyer") ? "checked" : ""}>
                <label for="destroyer">Destroyer</label>
            </div>
        `;
        document.getElementById("fleet").innerHTML = fleetOutput;
    }

    getDisplayValue(row, col) {
        if (this.showScores) {
            return solver.probabilities[row][col].score;
        } else if (this.showPercentages) {
            return solver.probabilities[row][col].percent;
        } else {
            return "";
        }
    }

    evaluate() {
        this.showLoading();
        solver.evaluate().then(() => {
            this.hideLoading();
            this.showUI();
        });
    }

    attachListeners() {
        document.addEventListener("click", (e) => {
            switch (true) {
                case e.target.matches(".cell"):
                case e.target.matches(".evaluate"):
                    this.targetRow = e.target.closest(".cell").dataset.row;
                    this.targetCol = e.target.closest(".cell").dataset.col;
                    this.targetCoord = e.target.closest(".cell").dataset.coord;
                    this.targetValue = solver.board[this.targetRow][this.targetCol];

                    this.showOverlay();
                    break;

                case e.target.matches("#close"):
                    this.hideOverlay();
                    break;

                case e.target.matches("#miss"):
                    this.hideOverlay();
                    solver.miss(Number(this.targetRow), Number(this.targetCol))
                    this.evaluate();
                    break;

                case e.target.matches("#hit"):
                    this.hideOverlay();
                    solver.hit(Number(this.targetRow), Number(this.targetCol))
                    this.evaluate();
                    break;

                case e.target.matches("#sunk"):
                    this.showTargetShips();
                    break;

                case e.target.matches("#clear"):
                    this.hideOverlay();
                    solver.clear(Number(this.targetRow), Number(this.targetCol))
                    this.evaluate();
                    break;

                case e.target.matches(".sink-ship"):
                    this.hideOverlay();
                    solver.hitAndSunk(e.target.value, Number(this.targetRow), Number(this.targetCol))
                    this.evaluate();
                    break;

                case e.target.matches(".toggle-info"):
                    this.showScores = false
                    this.showPercentages = false

                    switch (e.target.value) {
                        case "scores":
                            this.showScores = true;
                            break;
                        case "percentages":
                            this.showPercentages = true;
                            break;
                    }
                    this.showUI();
                    break;

                case e.target.matches(".toggle-ship"):
                    let checkbox = e.target;
                    let checkboxes = e.target.closest("#fleet").getElementsByTagName("input");
                    let fleet = []
                    for (let i = 0; i < checkboxes.length; i++) {
                        if (checkboxes[i].checked) {
                            fleet.push(solver.newShip(checkboxes[i].value));
                        }
                    }
                    solver.fleet = fleet;
                    let ship = solver.fleet.find(ship => ship.name == checkbox.value)
                    if (ship) {
                        for (let row = 0; row < solver.board.length; row++) {
                            for (let col = 0; col < solver.board.length; col++) {
                                if (solver.board[row][col] == ship.id) {
                                    solver.board[row][col] = EMPTY;
                                    continue;
                                }
                            }
                        }
                    }
                    this.evaluate();
                    break;

                case e.target.matches("#reset"):
                    solver = new Solver;
                    this.evaluate();
                    break;
            }
        })
    }

    #getColor(value) {
        value = (value - solver.minScore) / (solver.maxScore - solver.minScore)
        let hue=((1-value)*120).toString(10);
        return ["hsl(",hue,",80%,70%)"].join("");
    }
}
