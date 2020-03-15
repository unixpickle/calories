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
            targetWeight = this.parseNumericField(this.targetWeight, 'target weight') * POUND_TO_KG;
            fixedValue = this.parseNumericField(this.fixedVariableValue,
                'fixed variable value');
        } catch (e) {
            console.trace(e);
            return;
        }
        const isMale = (this.sex.value == '1');

        const bmr = new RevisedHarrisBenedictBMR(height, age, isMale);
        const tabulator = new Tabulator(weight, bmr, pal);

        this.currentBmr.textContent = Math.round(bmr.bmrForWeight(weight)) + ' Calories';
        this.currentTee.textContent = Math.round(bmr.bmrForWeight(weight) * pal) + ' Calories';
        this.updateVariables(tabulator, targetWeight, fixedValue);
    }

    updateVariables(tabulator, targetWeight, fixedValue) {
        const fv = this.fixedVariable.value;
        this.fixedVariableValue.value = fixedValue;
        this.fixedVariableName.innerText = FIXED_VARIABLE_NAMES[fv];
        Object.keys(FIXED_VARIABLE_NAMES).forEach((name) => {
            if (name !== fv) {
                this.dynamicVariableName.innerText = FIXED_VARIABLE_NAMES[name];
            }
        });

        const solution = this.solveVariable(fv, tabulator, targetWeight, fixedValue);
        this.dynamicVariableValue.textContent = solution;
    }

    solveVariable(name, tabulator, targetWeight, fixedValue) {
        if (name === 'days') {
            const calories = tabulator.caloriesForTarget(targetWeight, fixedValue);
            if (isNaN(calories)) {
                return 'Unattainable';
            } else {
                return Math.round(calories) + ' Calories';
            }
        } else if (name === 'calories') {
            let rows = tabulator.tabulateForCalories(fixedValue);
            for (let i = 0; i < 10000; ++i) {
                const day = rows.next().value;
                if ((day.weight < targetWeight) !== (tabulator.initWeight < targetWeight)) {
                    return i + ' days';
                }
            }
            return 'Unattainable';
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
