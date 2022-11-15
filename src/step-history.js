export default class StepHistory {
    /**
     * @type {{squares:number[], currentPlayer:string, winner: string}[]}
     */
    steps = [];
    stepNumber = 0;
    constructor(initialSquares, currentPlayer) {
        if(initialSquares === undefined || currentPlayer === undefined) return;
        this.steps.push(this.createStep(initialSquares, currentPlayer));
        this.stepNumber = this.steps.length - 1;
    };

    static fromSteps(steps) {
        const history = new StepHistory();
        history.steps = steps;
        history.stepNumber = steps.length - 1;
        return history;
    }
    
    /**
     * @private 
     * @param {number[]} squares 
     * @param {string} currentPlayer 
     * @param {string|null} winner 
     */
    createStep(squares, currentPlayer, winner=null){
        return {
            squares: [...squares],
            currentPlayer,
            winner
        };
    }

    /**
     * @param {number[]} squares 
     * @param {'X' | 'O'} currentPlayer 
     * @returns {StepHistory} updated copy of `StepHistory`
     */
    recordStep(squares, currentPlayer, winner=null) {
        const newSteps = this.steps
        .slice(0, this.stepNumber + 1);
        
        newSteps.push(this.createStep(squares, currentPlayer, winner));
        return StepHistory.fromSteps(newSteps);
    }

    /**
     * 
     * @returns member of `StepHistoy.step` where the `StepHistoy.stepNumber` is at
     */
    getCurrentStep() {
        const currentStep = this.steps[this.stepNumber];
        return this.createStep(currentStep.squares, currentStep.currentPlayer, currentStep.winner);
    }

    /**
     * 
     * @param {number} stepNumber index of desired `StepHistory.step`
     * @returns {StepHistory}  copy with desired `StepHistory.stepNumber`
     */
    jumpToStep(stepNumber){
        const historyCopy = new StepHistory();
        historyCopy.steps = [...this.steps];
        historyCopy.stepNumber = stepNumber;
        return historyCopy;
    }
}
