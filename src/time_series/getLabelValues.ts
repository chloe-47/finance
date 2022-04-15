import type { ValueRange } from './getValueRange';

export default function getLabelValues(
  { minValue, maxValue }: Omit<ValueRange, 'labelValues'>,
  step: number,
): Array<number> {
  if (minValue !== 0) {
    throw new Error('getAllValueLabels does not support negative values');
  }
  if (maxValue < 1) {
    throw new Error('getAllValueLabels does not support maxValue < 1');
  }
  let floorOrderOfMagnitude = 1;
  while (floorOrderOfMagnitude * 10 < maxValue) {
    floorOrderOfMagnitude *= 10;
  }
  let normalizedMaxValue = maxValue / floorOrderOfMagnitude;
  if (!(1 <= normalizedMaxValue && normalizedMaxValue <= 10)) {
    throw new Error(
      `Normalization failed -- maxValue=${maxValue}, floorOrderOfMagnitude=${floorOrderOfMagnitude}, normalizedMaxValue=${normalizedMaxValue}`,
    );
  }
  if (normalizedMaxValue < 3) {
    normalizedMaxValue *= 10;
    floorOrderOfMagnitude /= 10;
  }

  const labelValues: Array<number> = [];
  for (
    let val = 0;
    val <= normalizedMaxValue + 1 || (labelValues.length - 1) % step !== 0;
    val++
  ) {
    labelValues.push(val * floorOrderOfMagnitude);
  }

  return labelValues;
}
