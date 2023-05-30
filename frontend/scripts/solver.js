const EMPTY = -1
const MISS = 0
const CARRIER = 1
const BATTLESHIP = 2
const SUBMARINE = 3
const CRUISER = 4
const DESTROYER = 5
const HIT = 6
const SUNK = 3

const CARRIER_LENGTH = 5
const BATTLESHIP_LENGTH = 4
const CRUISER_LENGTH = 3
const SUBMARINE_LENGTH = 3
const DESTROYER_LENGTH = 2

class Ship {
    constructor(id, name, size) {
        this.id = id;
        this.name = name;
        this.size = size;
    }
}

class Solver {
    constructor() {
        this.board = [
            [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]
        ]
        this.fleet = [
            new Ship(CARRIER, "carrier", 5),
            new Ship(BATTLESHIP, "battleship", 4),
            new Ship(SUBMARINE, "submarine", 3),
            new Ship(CRUISER, "cruiser", 3),
            new Ship(DESTROYER, "destroyer", 2)
        ]
        this.probabilities = [];
        this.minScore = 0;
        this.maxScore = 0;
        this.bestCell = {};
        this.errors = [];
    }

    newShip(shipName) {
        switch (shipName) {
            case "carrier":
                return new Ship(CARRIER, "carrier", CARRIER_LENGTH);
            case "battleship":
                return new Ship(BATTLESHIP, "battleship", BATTLESHIP_LENGTH);
            case "submarine":
                return new Ship(SUBMARINE, "submarine", SUBMARINE_LENGTH);
            case "cruiser":
                return new Ship(CRUISER, "cruiser", CRUISER_LENGTH);
            case "destroyer":
                return new Ship(DESTROYER, "destroyer", DESTROYER_LENGTH);
        }
    }

    async evaluate() {
        let ships = []
        for (let i = 0; i < this.fleet.length; i++) {
            ships.push(this.fleet[i].name);
        }
        const res = await fetch(
            `/evaluate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "board": this.board,
                    "fleet": ships
                }),
                cache: 'default'
            }
        );
        
        try {
            const data = await res.json();
            this.updateState(data);
            return data
        } catch (error) {
            return error;
        }
    }

    updateState(data) {
        let totalScore = 0;
        let minScore = 100;
        let maxScore = 0;

        for (let row = 0; row < data.probabilities.length; row++) {
            for (let col = 0; col < data.probabilities[row].length; col++) {
                totalScore += data.probabilities[row][col]
                if (data.probabilities[row][col] > 0) {
                    minScore = Math.min(minScore, data.probabilities[row][col])
                }
                maxScore = Math.max(maxScore, data.probabilities[row][col])
            }
        }

        let probabilities = []
        let bestCell = data.bestCell
        for (let row = 0; row < data.probabilities.length; row++) {
            let newRow = []
            for (let col = 0; col < data.probabilities[row].length; col++) {
                let score = data.probabilities[row][col]
                let percent = (Math.round(((score/totalScore) + Number.EPSILON) * 10000) / 100)

                if (row == data.bestCell.coordinates[0] && col == data.bestCell.coordinates[1]) {
                    bestCell["weight"] = score;
                    bestCell["percent"] = percent;
                }

                newRow.push({score: data.probabilities[row][col], percent: percent})
            }
            probabilities.push(newRow);
        }

        this.probabilities = probabilities;
        this.minScore = minScore;
        this.maxScore = maxScore;
        this.bestCell = bestCell;
        this.errors = data.errors;
    }

    hit(row, col) {
        this.board[row][col] = HIT;
    }

    miss(row, col) {
        this.board[row][col] = MISS;
    }

    clear(row, col) {
        switch (this.board[row][col]) {
            case CARRIER:
                this.fleet.push(this.newShip("carrier"))
                break;
            case BATTLESHIP:
                this.fleet.push(this.newShip("battleship"))
                break;
            case SUBMARINE:
                this.fleet.push(this.newShip("submarine"))
                break;
            case CRUISER:
                this.fleet.push(this.newShip("cruiser"))
                break;
            case DESTROYER:
                this.fleet.push(this.newShip("destroyer"))
                break;
        }
        this.board[row][col] = EMPTY;
    }

    hitAndSunk(shipName, row, col) {
        let ship = this.fleet.find(x => x.name == shipName);
        this.board[row][col] = ship.id;
        this.fleet = this.fleet.filter(s => {
            return s != ship;
        });
    }
}
