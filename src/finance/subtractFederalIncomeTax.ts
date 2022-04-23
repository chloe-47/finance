export default function subtractFederalIncomeTax({
  monthlyIncome,
}: {
  monthlyIncome: number;
}): number {
  const annualIncome = monthlyIncome * 12;
  const taxAmount = getTaxAmount(annualIncome);
  return (annualIncome - taxAmount) / 12;
}

function getTaxAmount(annualIncome: number): number {
  for (const [floor, percent] of brackets) {
    if (annualIncome > floor) {
      return percent * 0.01 * (annualIncome - floor) + getTaxAmount(floor);
    }
  }
  return 0;
}

// https://www.nerdwallet.com/article/taxes/federal-income-tax-brackets
const brackets: Array<[number, number]> = [
  [523600, 37],
  [209425, 35],
  [164925, 32],
  [86375, 24],
  [40525, 22],
  [9950, 12],
  [0, 10],
];
