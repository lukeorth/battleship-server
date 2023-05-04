let solver = new Solver;
let ui = new UI;

solver.evaluate().then(() => {
        ui.loading = false;
        ui.attachListeners()
        ui.showBoard()
    }
);
