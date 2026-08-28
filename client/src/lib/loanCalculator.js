export function calculateEMI(principal, annualInterestRate, termMonths) {
    const p = Number(principal);
    const rate = Number(annualInterestRate);
    const months = Number(termMonths);

    if (!p || !months || months <= 0) return 0;

    const monthlyRate = rate / 12 / 100;

    if (monthlyRate === 0) {
        return p / months;
    }

    const factor = Math.pow(1 + monthlyRate, months);
    return (p * monthlyRate * factor) / (factor - 1);
}