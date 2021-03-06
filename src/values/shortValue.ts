type Options = Readonly<{
  noDecimalPoints?: true;
}>;

export default function shortValue(value: number, options?: Options): string {
  const decimalPoints = !options?.noDecimalPoints;
  let sign = '';
  if (value < 0) {
    value *= -1;
    sign = '-';
  }
  if (value === 0) {
    return '$0';
  } else if (value < 1e2) {
    return `$${sign}${value.toFixed(decimalPoints ? 2 : 0)}`;
  } else if (value < 1e3) {
    return `$${sign}${value.toFixed(0)}`;
  } else if (value < 1e6) {
    return withMultiplierSuffix(1e3, 'K');
  } else if (value < 1e9) {
    return withMultiplierSuffix(1e6, 'M');
  } else if (value < 1e12) {
    return withMultiplierSuffix(1e6, 'B');
  } else {
    return `$${value.toExponential(2)}`;
  }

  function withMultiplierSuffix(divisor: number, suffix: string): string {
    const quotient = value / divisor;
    const points = !decimalPoints
      ? quotient < 2
        ? 1
        : 0
      : quotient < 10
      ? 2
      : quotient < 100
      ? 1
      : 0;
    return `$${sign}${quotient.toFixed(points)}${suffix}`;
  }
}
