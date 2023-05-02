class UI {
    constructor() {
        this.showScores = true;
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

                if (row == solver.bestCell.coordinates[0] && col == solver.bestCell.coordinates[1]) {
                    output += `
                        <div class="cell" data-row="${row}" data-col="${col}" data-coord="${letter}${col + 1}" style="background:${color};">
                            <svg class="evaluate" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path fill="currentColor" d="M7.5 0h1v4L8 6l-.5-2V0zm1 16h-1v-4l.5-2l.5 2v4zM16 7.5v1h-4L10 8l2-.5h4zm-16 1v-1h4L6 8l-2 .5H0z"/>
                                <path fill="currentColor" d="M8 2.5a5.5 5.5 0 1 1 0 11A5.5 5.5 0 0 1 2.5 8a5.51 5.51 0 0 1 5.499-5.5zM8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1z"/>
                            </svg>
                            <span class="evaluate best-cell">
                                ${this.getDisplayValue(row, col)}
                            </span>
                        </div>
                    `;
                } else {
                    output += `<div class="cell" data-row="${row}" data-col="${col}" data-coord="${letter}${col + 1}" style="background:${color};">
                        <span class="evaluate">
                            ${this.getDisplayValue(row, col)}
                        </span>
                    </div>
                    `;
                }
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

            if (e.target.matches(".evaluate")) {
                console.log('hi');
                let row = e.target.parentNode.dataset.row;
                let col = e.target.parentNode.dataset.col;
                let coord = e.target.parentNode.dataset.coord;

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
