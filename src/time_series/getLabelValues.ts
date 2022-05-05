import type { ValueRange } from './getValueRange';

export default function getLabelValues(
  { minValue, maxValue }: Omit<ValueRange, 'labelValues'>,
  step: number,
): Array<number> {
  const absoluteMax = Math.max(Math.abs(minValue), Math.abs(maxValue));
  if (absoluteMax < 1) {
    throw new Error('getLabelValues does not support absoluteMax < 1');
  }
  let floorOrderOfMagnitude = 1;
  while (floorOrderOfMagnitude * 10 < absoluteMax) {
    floorOrderOfMagnitude *= 10;
  }
  let normalizedMaxValue = maxValue / floorOrderOfMagnitude;
  let normalizedMinValue = minValue / floorOrderOfMagnitude;

  if (normalizedMaxValue < 3 && normalizedMinValue < 3) {
    normalizedMaxValue *= 10;
    normalizedMinValue *= 10;
    floorOrderOfMagnitude /= 10;
  }

  const labelValues: Array<number> = [];
  for (
    let val = normalizedMinValue === 0 ? 0 : normalizedMinValue - 1;
    val <= normalizedMaxValue + 1 || (labelValues.length - 1) % step !== 0;
    val++
  ) {
    labelValues.push(val * floorOrderOfMagnitude);
  }

  return labelValues;
}
