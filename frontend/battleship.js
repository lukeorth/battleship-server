class Battleship {
    constructor() {
        this.board = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]
        this.fleet = ["carrier", "battleship", "cruiser", "submarine", "destroyer"]
    }

    async evaluate() {
        const evaluateResponse = await fetch(
            `https://battleship.lukeorth.com/evaluate`, {
                Method: 'POST',
                Headers: {
                    Accept: 'application.json',
                    'Content-Type': 'application/json'
                },
                Body: {
                    "board": this.board,
                    "fleet": this.fleet
                },
                Cache: 'default'
            }
        );

        const evaluate = await evaluateResponse.json();

        return evaluate
    }
}
