const fs = require('fs');

// Function to decode the value from the given base
function decodeValue(value, base) {
    return parseInt(value, base);
}

// Lagrange interpolation to find the polynomial constant term (c)
function lagrangeInterpolationAt0(roots) {
    const n = roots.length;
    let result = 0;

    // Loop over each root to compute its contribution to the constant term
    for (let i = 0; i < n; i++) {
        const [x_i, y_i] = roots[i];

        // Compute Lagrange basis polynomial L_i(0)
        let L_i_at_0 = 1;
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                const [x_j] = roots[j];
                L_i_at_0 *= x_j / (x_j - x_i);
            }
        }

        // Add the contribution of this term to the result (constant term)
        result += y_i * L_i_at_0;
    }

    return result;
}

// Function to solve for the constant term by reading from a JSON file
function solveForConstantTerm(filePath) {
    // Read the JSON data from the file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Extract the roots from the JSON structure
    const roots = [];
    for (let key in data) {
        if (key !== 'keys') {  // Skip metadata (the 'keys' field)
            const base = parseInt(data[key].base);
            const value = data[key].value;
            const y = decodeValue(value, base);  // Decode the y-coordinate
            const x = parseInt(key);  // The key itself is the x-coordinate
            roots.push([x, y]);
        }
    }

    // Find the constant term using Lagrange interpolation at x = 0
    const constantTerm = lagrangeInterpolationAt0(roots);
    return constantTerm;
}

// Example usage with two different test case JSON files
const testCase1 = 'input_data_case1.json';  // Path to the first input JSON file
const testCase2 = 'input_data_case2.json';  // Path to the second input JSON file

const constantTerm1 = solveForConstantTerm(testCase1);
const constantTerm2 = solveForConstantTerm(testCase2);

// Print results for both test cases simultaneously
console.log('Test Case 1 Secret (Constant Term) is: ${constantTerm1}');
console.log('Test Case 2 Secret (Constant Term) is: ${constantTerm2}');
