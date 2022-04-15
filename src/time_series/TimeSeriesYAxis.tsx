import * as React from 'react';
import type { TimeSeriesChartDefinitionWithMaybeIncompleteChartSize } from 'src/time_series/SeriesTypes';
import type { Offset } from 'src/measurements/LabelArray';
import LabelArray from 'src/measurements/LabelArray';
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
      labels={allValueLabels}
      pointRadius={pointRadius}
      setOffset={setOffset}
      setStep={setStep}
      widthOrHeight={height}
    />
  );
}
