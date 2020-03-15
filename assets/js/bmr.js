// A BMR calculator based on the Harris-Benedict equation:
// https://en.wikipedia.org/wiki/Harris%E2%80%93Benedict_equation.
//
// This operates using metric units (kg and cm).
class HarrisBenedictBMR {
    constructor(height, age, isMale) {
        this.height = height;
        this.age = age;
        this.isMale = isMale;
    }

    bmrForWeight(weight) {
        const coeffs = this.coefficients();
        return coeffs[0] + coeffs[1] * weight + coeffs[2] * this.height + coeffs[3] * this.age;
    }

    coefficients() {
        if (this.isMale) {
            return [66.5, 13.75, 5.003, 6.755];
        } else {
            return [655.1, 9.563, 1.850, 4.676];
        }
    }
}

// Revised Harris-Benedict BMR from Roza and Shizgal.
class RevisedHarrisBenedictBMR extends HarrisBenedictBMR {
    coefficients() {
        if (this.isMale) {
            return [88.362, 13.397, 4.799, 5.677];
        } else {
            return [447.593, 9.247, 3.098, 4.330];
        }
    }
}
