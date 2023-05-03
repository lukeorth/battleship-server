const MISS = 0
const EMPTY = 1
const HIT = 2
const SUNK = 3

const CARRIER_LENGTH = 5
const BATTLESHIP_LENGTH = 4
const CRUISER_LENGTH = 3
const SUBMARINE_LENGTH = 3
const DESTROYER_LENGTH = 2

class Ship {
    constructor(name, size) {
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
            new Ship("carrier", 5),
            new Ship("battleship", 4),
            new Ship("cruiser", 3),
            new Ship("submarine", 3),
            new Ship("destroyer", 2)
        ]
        this.probabilities = [];
        this.minScore = 0;
        this.maxScore = 0;
        this.hits = {}
        this.moves = {}
        this.bestCell = {};
    }

    newShip(shipName) {
        switch (shipName) {
            case "carrier":
                return new Ship("carrier", CARRIER_LENGTH);
            case "battleship":
                return new Ship("battleship", BATTLESHIP_LENGTH);
            case "cruiser":
                return new Ship("cruiser", CRUISER_LENGTH);
            case "submarine":
                return new Ship("submarine", SUBMARINE_LENGTH);
            case "destroyer":
                return new Ship("destroyer", DESTROYER_LENGTH);
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
            const evaluate = await res.json();
            return evaluate
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
        for (let row = 0; row < data.probabilities.length; row++) {
            let newRow = []
            for (let col = 0; col < data.probabilities[row].length; col++) {
                let score = data.probabilities[row][col]
                let percent = (Math.round(((score/totalScore) + Number.EPSILON) * 10000) / 100)

                newRow.push({score: data.probabilities[row][col], percent: percent})
            }
            probabilities.push(newRow);
        }

        this.probabilities = probabilities
        this.minScore = minScore
        this.maxScore = maxScore
        this.bestCell = data.bestCell
    }

    hit(row, col, coord) {
        this.moves[coord] = [{cell: [row, col], old: this.board[row][col]}];
        this.hits[coord] = [col, row];
        this.board[row][col] = HIT;
        return this.evaluate();
    }

    miss(row, col, coord) {
        this.moves[coord] = [{cell: [row, col], old: this.board[row][col]}];
        this.board[row][col] = MISS;
        return this.evaluate();
    }

    #hitAndSunk(shipName, row, col, coord) {
        this.moves[coord] = [{cell: [row, col], old: this.board[col][row]}];
        this.board[col][row] = SUNK;
    }
    
    #getShipByName(ship) {
        for (let i = 0; i < this.fleet.length; i++) {
            if (this.fleet[i].name == ship) {
                return fleet[i]
            }
        }
        return null
    }
}
