import * as React from 'react';
import type { Offset } from 'src/measurements/LabelArray';
import LabelArray from 'src/measurements/LabelArray';
import type { TimeSeriesChartDefinitionWithMaybeIncompleteChartSize } from 'src/time_series/SeriesTypes';
import shortValue from 'src/values/shortValue';
import type { ValueRange } from './getValueRange';

type Props = {
  definition: TimeSeriesChartDefinitionWithMaybeIncompleteChartSize;
  setOffset: (offset: Offset) => void;
  setStep: (step: number) => void;
  valueRange: ValueRange;
};

export default function TimeSeriesYAxis({
  definition,
  setOffset,
  setStep,
  valueRange,
}: Props): JSX.Element {
  const { chartSize } = definition;
  const { pointRadius, height } = chartSize;
  const allValueLabels = React.useMemo(() => {
    return valueRange.labelValues.map((val) =>
      shortValue(val, { noDecimalPoints: true }),
    );
  }, [valueRange]);

  if (height === undefined) {
    return <div />;
  }

  return (
    <LabelArray
      direction="up"
      labels={allValueLabels.map((label, index, arr) => ({
        label,
        ratio: index / (arr.length - 1),
      }))}
      pointRadius={pointRadius}
      setOffset={setOffset}
      setStep={setStep}
      widthOrHeight={height}
    />
  );
}
