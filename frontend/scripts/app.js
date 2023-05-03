let solver = new Solver;
let ui = new UI;

solver.evaluate().then(data => {
    solver.updateState(data)
    ui.attachListeners();
    ui.showBoard();
})


