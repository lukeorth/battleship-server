let solver = new Solver;
let ui = new UI;

solver.evaluate().then(() => {
        ui.attachListeners()
        ui.showBoard()
    }
);
