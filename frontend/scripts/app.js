let solver = new Solver;
let ui = new UI;

solver.evaluate().then(() => {
        ui.hideLoading();
        ui.attachListeners();
        ui.showUI();
    }
);
