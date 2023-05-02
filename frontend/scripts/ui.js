class UI {
    constructor() {
        this.showScores = false;
        this.showPercentages = false;
        this.bestCoord = document.getElementById("best-coord");
    }

    showBoard() {
        let output = `
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

            output += `
                <div class="border-cell">
                    <span class="label">${letter}</span>
                </div>
            `;
            for (let col = 0; col < solver.probabilities[row].length; col++) {
                let score = solver.probabilities[row][col].score
                let color = score > 0 ? this.getColor(score) : "#F5F5F5"

                let style = `background:${color};`
                if (row == solver.bestCell.coordinates[0] && col == solver.bestCell.coordinates[1]) {
                    style += "border:#333333 solid 4px;"
                }

                output += `
                    <div class="cell" data-row="${row}" data-col="${col}" data-coord="${letter}${col + 1}" style="${style}">
                        ${this.getDisplayValue(row, col)}
                    </div>
                `;
            }
        }
        document.getElementById("gameboard").innerHTML = output;
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

    attachListeners() {
        document.addEventListener("click", (e) => {
            if (e.target.matches(".cell")) {
                let row = e.target.dataset.row;
                let col = e.target.dataset.col;
                let coord = e.target.dataset.coord;

                solver.miss(row, col, coord).then(data => {
                    solver.updateState(data)
                    this.showBoard();
                    this.updateBestCoord();
                });
            }

            if (e.target.matches(".toggle")) {
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

                this.showBoard();
            }
        })
    }

    getColor(value) {
        value = (value - solver.minScore) / (solver.maxScore - solver.minScore)
        let hue=((1-value)*120).toString(10);
        return ["hsl(",hue,",80%,70%)"].join("");
    }

    updateBestCoord() {
        this.bestCoord.innerHTML = `Best: ${solver.bestCell.position}`;
    }
}
