const solver = new Solver;
const ui = new UI;

solver.evaluate().then(data => {
    solver.updateState(data)
    ui.attachListeners();
    ui.updateBestCoord();
    ui.showBoard(data.probabilities);
})


