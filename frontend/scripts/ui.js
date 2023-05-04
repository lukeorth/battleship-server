class UI {
    constructor() {
        this.showScores = true;
        this.showPercentages = false;
        this.targetRow = 0;
        this.targetCol = 0;
        this.targetCoord = "A1";
    }

    showUI() {
        this.showInfo();
        this.showBoard();
        this.showFleet();
    }

    showInfo() {
        let infoOutput = `
            <h3>Info</h3>

            <p id="best-coord">${solver.bestCell.position}</p>

            <p>Show:</p>
            <input type="radio" id="scores" name="toggle-info" class="toggle-info" value="scores" ${this.showScores ? "checked" : ""}>
            <label for="scores">Scores</label><br>
            <input type="radio" id="percentages" name="toggle-info" class="toggle-info" value="percentages" ${this.showPercentages ? "checked" : ""}>
            <label for="percentages">Percentages</label><br>
            <input type="radio" id="none" name="toggle-info" class="toggle-info" value="none" ${!this.showScores && !this.showPercentages ? "checked" : ""}>
            <label for="none">None</label><br>

            <button id="reset">Reset</button>
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
                let color = score > 0 ? this.getColor(score) : "#F5F5F5"

                if (row == solver.bestCell.coordinates[0] && col == solver.bestCell.coordinates[1]) {
                    boardOutput += `
                        <div class="cell" data-row="${row}" data-col="${col}" data-coord="${letter}${col + 1}" style="background:${color};">
                            <svg class="evaluate" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path class="evaluate" fill="currentColor" d="M3.05 13H1v-2h2.05C3.5 6.83 6.83 3.5 11 3.05V1h2v2.05c4.17.45 7.5 3.78 7.95 7.95H23v2h-2.05c-.45 4.17-3.78 7.5-7.95 7.95V23h-2v-2.05C6.83 20.5 3.5 17.17 3.05 13M12 5a7 7 0 0 0-7 7a7 7 0 0 0 7 7a7 7 0 0 0 7-7a7 7 0 0 0-7-7Z"/>
                            </svg>
                            <span class="evaluate best-cell">
                                ${this.getDisplayValue(row, col)}
                            </span>
                        </div>
                    `;
                } else {
                    boardOutput += `<div class="cell" data-row="${row}" data-col="${col}" data-coord="${letter}${col + 1}" style="background:${color};">
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
                <h3>${this.targetCoord}</h3>
                <button id="miss">Miss</button>
                <button id="hit">Hit</button>
            </div>
            `;
        document.getElementById("gameboard-overlay").innerHTML = overlayOutput;
        document.getElementById("gameboard-overlay").style.display = "flex";
    }

    hideOverlay() {
        document.getElementById("gameboard-overlay").style.display = "none";
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
            <h3>Fleet</h3>
            <input type="checkbox" id="carrier" name="toggle-ship" class="toggle-ship" value="carrier" ${solver.fleet.find(ship => ship.name == "carrier") ? "checked" : ""}>
            <label for="carrier">Carrier</label><br>
            <input type="checkbox" id="battleship" name="toggle-ship" class="toggle-ship" value="battleship" ${solver.fleet.find(ship => ship.name == "battleship") ? "checked" : ""}>
            <label for="battleship">Battleship</label><br>
            <input type="checkbox" id="submarine" name="toggle-ship" class="toggle-ship" value="submarine" ${solver.fleet.find(ship => ship.name == "submarine") ? "checked" : ""}>
            <label for="submarine">Submarine</label><br>
            <input type="checkbox" id="cruiser" name="toggle-ship" class="toggle-ship" value="cruiser" ${solver.fleet.find(ship => ship.name == "cruiser") ? "checked" : ""}>
            <label for="cruiser">Cruiser</label><br>
            <input type="checkbox" id="destroyer" name="toggle-ship" class="toggle-ship" value="destroyer" ${solver.fleet.find(ship => ship.name == "destroyer") ? "checked" : ""}>
            <label for="destroyer">Destroyer</label><br>
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

            if (e.target.matches(".cell") || e.target.matches(".evaluate")) {
                this.targetRow = e.target.closest(".cell").dataset.row;
                this.targetCol = e.target.closest(".cell").dataset.col;
                this.targetCoord = e.target.closest(".cell").dataset.coord;

                this.showOverlay();
            }

            if (e.target.matches("#miss")) {
                this.hideOverlay();
                solver.miss(this.targetRow, this.targetCol, this.targetCoord)
                this.evaluate();
            }

            if (e.target.matches("#hit")) {
                this.hideOverlay();
                solver.hit(this.targetRow, this.targetCol, this.targetCoord)
                this.evaluate();
            }

            if (e.target.matches(".toggle-info")) {
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
            }

            if (e.target.matches(".toggle-ship")) {
                let checkboxes = e.target.closest("#fleet").getElementsByTagName("input");
                let fleet = []
                for (let i = 0; i < checkboxes.length; i++) {
                    if (checkboxes[i].checked) {
                        fleet.push(solver.newShip(checkboxes[i].value));
                    }
                    solver.fleet = fleet;
                }
                this.evaluate();
            }

            if (e.target.matches("#reset")) {
                solver = new Solver;
                this.evaluate();
            }
        })
    }

    getColor(value) {
        value = (value - solver.minScore) / (solver.maxScore - solver.minScore)
        let hue=((1-value)*120).toString(10);
        return ["hsl(",hue,",80%,70%)"].join("");
    }
}
