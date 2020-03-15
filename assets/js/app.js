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
        this.targetWeight = document.getElementById('target-weight');
        this.fixedVariable = document.getElementById('fixed-variable');
        this.fixedVariableName = document.getElementById('fixed-variable-name');
        this.fixedVariableValue = document.getElementById('fixed-variable-value');
        this.dynamicVariableName = document.getElementById('dynamic-variable-name');
        this.dynamicVariableValue = document.getElementById('dynamic-variable-value');
    }

    updateTables() {
        let weight, height, age, pal, targetWeight, fixedValue;
        try {
            weight = this.parseNumericField(this.startWeight, 'weight') * POUND_TO_KG;
            height = (this.parseNumericField(this.heightFt, 'height (feet)') * 12 +
                this.parseNumericField(this.heightInch, 'height (inch)')) * INCH_TO_CM;
            age = this.parseNumericField(this.age, 'age');
            pal = this.parseNumericField(this.pal, 'activity level');
            targetWeight = this.parseNumericField(this.targetWeight, 'target weight');
            fixedValue = this.parseNumericField(this.fixedVariable, 'fixed variable value');
        } catch (e) {
            alert(e.toString());
            return;
        }
        const isMale = (this.sex.value == '1');

        const bmr = new RevisedHarrisBenedictBMR(height, age, isMale);
        const tabulator = new Tabulator(weight, bmr, pal);

        this.currentBmr.value = bmr.bmrForWeight(weight);
        this.currentTee.value = bmr.bmrForWeight(weight) * pal;
        this.solveVariables(tabulator, fixedValue);
    }

    solveVariables(tabulator, targetWeight, fixedValue) {
        const fv = this.fixedVariable.value;
        this.fixedVariableName.innerText = FIXED_VARIABLE_NAMES[fv];
        Object.keys(FIXED_VARIABLE_NAMES).forEach((name) => {
            if (name !== fv) {
                this.dynamicVariableName.innerText = FIXED_VARIABLE_NAMES[name];
            }
        });

        if (fv === 'days') {
            const days = fixedValue;
            // TODO: binary search of some kind.
        } else {
            let rows = tabulator.tabulateForCalories();
            for (let i = 0; i < 10000; ++i) {
                const day = rows.next();
                if ((day.weight < targetWeight) !== tabulator.initWeight < targetWeight) {
                    this.dynamicVariableValue.value = i;
                    return;
                }
            }
            this.dynamicVariableValue.value = 'cannot reach target weight';
        }
    }

    parseNumericField(field, name) {
        const res = parseFloat(field);
        if (Math.isNaN(res) || res < 0) {
            throw new Error('You entered an invalid ' + name + '.');
        }
        return res;
    }
}

window.app = new App();
