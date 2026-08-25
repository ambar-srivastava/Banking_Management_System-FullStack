function calculateEMI(principal, annualInterestRate, termMonths) {
    const monthlyRate = annualInterestRate / 12 / 100;

    if (monthlyRate === 0) {
        // Edge case: a 0% interest loan is just principal divided evenly
        return parseFloat((principal / termMonths).toFixed(2));
    }

    const factor = Math.pow(1 + monthlyRate, termMonths);
    const emi = (principal * monthlyRate * factor) / (factor - 1);

    return parseFloat(emi.toFixed(2));
}

module.exports = { calculateEMI };