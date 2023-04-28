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
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "board": this.board,
                    "fleet": this.fleet
                }),
                cache: 'default'
            }
        );

        const evaluate = await evaluateResponse.json();

        return evaluate
    }
}
