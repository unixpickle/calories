// About how many calories it takes to burn a kilogram of
// body fat.
const CALORIES_PER_KG = 7716.179;

class Tabulator {
    // Create a Tabulator using an initial weight, a BMR
    // function like HarrisBenedictBMR, and a physical
    // activity level (scale to convert BMR to TEE).
    constructor(initWeight, bmr, pal) {
        this.initWeight = initWeight;
        this.bmr = bmr;
        this.pal = pal;
    }

    *tabulateForCalories(calories, numDays) {
        let current = this._createDay(this.initWeight, calories);
        while (true) {
            yield current;
            current = this._createDay(current.weight + current.weightDelta(), calories);
        }
    }

    _createDay(weight, calories) {
        const bmr = this.bmr.bmrForWeight(weight);
        return new DayStats(weight, bmr, bmr * this.pal, calories);
    }
}

class DayStats {
    constructor(weight, bmr, tee, calories) {
        this.weight = weight;
        this.bmr = bmr;
        this.tee = tee;
        this.calories = calories;
    }

    weightDelta() {
        return (this.calories - this.tee) * CALORIES_PER_KG;
    }
}
