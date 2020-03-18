const FIXED_VARIABLE_NAMES = {
    'calories': 'Daily calories',
    'days': 'Days to reach goal',
};

const INCH_TO_CM = 2.54;
const POUND_TO_KG = 0.453592;

class App {
    constructor() {
        this.startWeight = document.getElementById('start-weight');
        this.heightFt = document.getElementById('height-ft');
        this.heightInch = document.getElementById('height-inch');
        this.age = document.getElementById('age');
        this.pal = document.getElementById('pal');
        this.sex = document.getElementById('sex');
        this.currentTee = document.getElementById('current-tee');
        this.currentBmr = document.getElementById('current-bmr');
        this.targetWeight1 = document.getElementById('target-weight-1');
        this.targetWeight2 = document.getElementById('target-weight-1');
        this.daysInput = document.getElementById('days-input');
        this.dailyCaloriesInput = document.getElementById('daily-calories-input');
        this.daysOutput = document.getElementById('days-output');
        this.dailyCaloriesOutput = document.getElementById('daily-calories-output');
    }

    updateTables() {
        let weight, height, age, pal;
        try {
            weight = this.parseNumericField(this.startWeight, 'weight') * POUND_TO_KG;
            height = (this.parseNumericField(this.heightFt, 'height (feet)') * 12 +
                this.parseNumericField(this.heightInch, 'height (inch)')) * INCH_TO_CM;
            age = this.parseNumericField(this.age, 'age');
            pal = this.parseNumericField(this.pal, 'activity level');
        } catch (e) {
            console.trace(e);
            return;
        }
        const isMale = (this.sex.value == '1');

        const bmr = new RevisedHarrisBenedictBMR(height, age, isMale);
        const tabulator = new Tabulator(weight, bmr, pal);

        this.currentBmr.textContent = Math.round(bmr.bmrForWeight(weight)) + ' Calories';
        this.currentTee.textContent = Math.round(bmr.bmrForWeight(weight) * pal) + ' Calories';
        this.updateSolvers(tabulator);
    }

    updateSolvers(tabulator) {
        let start, target1, target2, daysInput, dailyCaloriesInput;
        try {
            start = this.parseNumericField(this.startWeight, 'weight') * POUND_TO_KG;
            target1 = this.parseNumericField(this.targetWeight1, 'target weight') * POUND_TO_KG;
            target2 = this.parseNumericField(this.targetWeight2, 'target weight') * POUND_TO_KG;
            daysInput = this.parseNumericField(this.daysInput, 'days');
            dailyCaloriesInput = this.parseNumericField(this.dailyCaloriesInput, 'daily calories');
        } catch (e) {
            console.trace(e);
            return;
        }

        this.setSolverSolution(this.dailyCaloriesOutput,
            tabulator.caloriesForTarget(target2, daysInput),
            'Calories');

        this.setSolverSolution(this.daysOutput,
            tabulator.daysForTarget(target1, dailyCaloriesInput),
            'days');
    }

    setSolverSolution(field, solution, units) {
        if (isNaN(solution) || solution < 0) {
            field.textContent = 'Unattainable';
        } else {
            field.textContent = Math.round(solution) + ' ' + units;
        }
    }

    parseNumericField(field, name) {
        const res = parseFloat(field.value);
        if (isNaN(res) || res < 0) {
            field.classList.add('invalid');
            field.focus();
            throw new Error('You entered an invalid ' + name + '.');
        } else {
            field.classList.remove('invalid');
        }
        return res;
    }
}

window.app = new App();
