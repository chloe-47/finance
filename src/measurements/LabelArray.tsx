import * as React from 'react';
import DateLabel from 'src/dates/DateLabel';
import type { LabelSpec } from 'src/dates/DateRange';
import useMeasurements from 'src/measurements/useMeasurements';

export type Offset = {
  dataViewMinCoordinate: number;
  dataViewMaxCoordinate: number;
  total: number;
};

type Props = {
  direction: 'right' | 'up';
  labels: ReadonlyArray<LabelSpec>;
  pointRadius: number;
  setOffset: (offset: Offset) => void;
  setStep?: (step: number) => void;
  widthOrHeight: number;
};

type ProcessedValues = {
  crossDimension: number;
  dataViewWidthOrHeight: number;
  dataViewMinCoordinate: number;
  firstLabel: string;
  lastLabel: string;
  dataViewMaxCoordinate: number;
  labelsToRender: Array<{ label: string; minCoordinate: number }>;
  step: number;
  total: number;
};

type Interval = {
  min: number;
  max: number;
};

export default function LabelArray({
  direction,
  labels,
  pointRadius,
  setOffset,
  setStep,
  widthOrHeight,
}: Props): JSX.Element {
  const [cachedCrossDimension, setCachedCrossDimension] = React.useState<
    number | undefined
  >();
  const labelStrings = React.useMemo(() => {
    return labels.map(({ label }) => label);
  }, [labels]);
  const measurements = useMeasurements({
    render: (val: string): JSX.Element => <DateLabel label={val} />,
    valToString: (v) => v,
    values: labelStrings,
  });

  const processedValues = React.useMemo((): ProcessedValues | undefined => {
    return getProcessedValues({
      direction,
      labels,
      measurements,
      pointRadius,
      widthOrHeight,
    });
  }, [labels, pointRadius, widthOrHeight, measurements]);

  React.useEffect(() => {
    if (processedValues != null) {
      const { dataViewMinCoordinate, dataViewMaxCoordinate, step, total } =
        processedValues;
      setCachedCrossDimension(processedValues.crossDimension);
      setOffset({ dataViewMaxCoordinate, dataViewMinCoordinate, total });
      setStep?.(step);
    }
  }, [processedValues]);

  if (processedValues == null) {
    return (
      <div
        style={
          cachedCrossDimension !== undefined
            ? {
                [direction === 'right' ? 'height' : 'width']:
                  cachedCrossDimension,
              }
            : {}
        }
      />
    );
  }

  const { crossDimension, firstLabel, lastLabel, labelsToRender, total } =
    processedValues;

  return (
    <div
      style={{
        alignItems: direction === 'right' ? 'center' : 'flex-end',
        display: 'flex',
        flexDirection: direction === 'right' ? 'row' : 'column-reverse',
        justifyContent: 'space-between',
        position: 'relative',
        [direction === 'right' ? 'width' : 'height']: total,
        [direction === 'right' ? 'height' : 'width']: crossDimension,
      }}
    >
      <div className="invisible">{firstLabel}</div>
      <div className="invisible">{lastLabel}</div>
      {labelsToRender.map(({ label, minCoordinate }) => {
        return (
          <div
            key={label}
            style={{
              [direction === 'right' ? 'left' : 'bottom']: minCoordinate,
              position: 'absolute',
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}

type GetProcessedValuesArgs = Omit<Props, 'setOffset'> & {
  measurements: ReturnType<typeof useMeasurements>;
};

function getProcessedValues({
  direction,
  labels,
  pointRadius,
  widthOrHeight,
  measurements,
}: GetProcessedValuesArgs): ProcessedValues | undefined {
  if (measurements == null) {
    return undefined;
  }

  if (labels.some(({ label }) => !measurements.has(label))) {
    return undefined;
  }

  if (labels.length < 2) {
    throw new Error(
      'LabelArray does not support lists of fewer than 2 elements',
    );
  }

  const firstLabel = getLabel(0);
  const lastLabel = getLabel(labels.length - 1);

  const firstLabelDimension = labelDimension(firstLabel);
  const lastLabelDimension = labelDimension(lastLabel);

  const spillStart = Math.max(firstLabelDimension / 2, pointRadius);
  const spillEnd = Math.max(lastLabelDimension / 2, pointRadius);

  const dataViewMinCoordinate = spillStart;
  const dataViewMaxCoordinate = widthOrHeight - spillEnd;
  const total = widthOrHeight;

  const dataViewWidthOrHeight = dataViewMaxCoordinate - dataViewMinCoordinate;

  let step = 1;
  for (step = 1; step < labels.length; step++) {
    const intervalsForMiddleLabels = computeIntervalsForMiddleLabels(step);
    const areAnyLabelsTooClose = computeAreAnyLabelsTooClose(
      intervalsForMiddleLabels,
    );

    if (!areAnyLabelsTooClose) {
      break;
    }
  }

  const labelsToInclude: Array<{ label: string; index: number }> = [];
  for (let index = 0; index < labels.length; index += step) {
    labelsToInclude.push({ index, label: getLabel(index) });
  }

  const labelsToRender = labelsToInclude.map(({ label, index }) => {
    const center = getCenterForIndex(index);
    const { min: minCoordinate } = getInterval(label, center);
    return { label, minCoordinate };
  });

  function computeIntervalsForMiddleLabels(step: number): Array<Interval> {
    const intervals: Array<Interval> = [];
    for (let index = step; index < labels.length - 1; index += step) {
      const label = getLabel(index);
      const center = getCenterForIndex(index);
      intervals.push(getInterval(label, center));
    }
    return intervals;
  }

  function computeAreAnyLabelsTooClose(intervals: Array<Interval>) {
    for (let i = 0; i < intervals.length; i++) {
      const interval = intervals[i];
      if (interval === undefined) {
        throw new Error('Unexpected undefined');
      }
      const { min, max } = interval;
      if (i === 0) {
        if (
          isTooClose({
            endOfPrevInterval: dataViewMinCoordinate + firstLabelDimension / 2,
            startOfNextInterval: min,
          })
        ) {
          return true;
        }
      } else {
        if (
          isTooClose({
            endOfPrevInterval: intervals[i - 1]?.max ?? 0,
            startOfNextInterval: min,
          })
        ) {
          return total;
        }
      }
      if (i === intervals.length - 1) {
        if (
          isTooClose({
            endOfPrevInterval: max,
            startOfNextInterval: dataViewMaxCoordinate - lastLabelDimension / 2,
          })
        ) {
          return true;
        }
      }
    }
    return false;
  }

  function isTooClose({
    endOfPrevInterval,
    startOfNextInterval,
  }: {
    endOfPrevInterval: number;
    startOfNextInterval: number;
  }): boolean {
    return startOfNextInterval - endOfPrevInterval < 16;
  }

  const crossDimension = Math.max(
    ...labels.map(({ label }) => labelCrossDimension(label)),
  );

  return {
    crossDimension,
    dataViewMaxCoordinate,
    dataViewMinCoordinate,
    dataViewWidthOrHeight,
    firstLabel,
    labelsToRender,
    lastLabel,
    step,
    total,
  };

  function labelDimension(label: string): number {
    return labelDimensionImpl(
      label,
      direction === 'right' ? 'width' : 'height',
    );
  }

  function labelCrossDimension(label: string): number {
    return labelDimensionImpl(
      label,
      direction === 'right' ? 'height' : 'width',
    );
  }

  function labelDimensionImpl(
    label: string,
    property: 'height' | 'width',
  ): number {
    if (measurements == null) {
      throw new Error(
        'labelWidth should not be called if measurements is null',
      );
    }
    const measurement = measurements.get(label);
    if (measurement == null) {
      throw new Error('measurement is missing for label: ' + label);
    }
    return measurement[property];
  }

  function getLabel(index: number): string {
    return getLabelSpec(index).label;
  }

  function getLabelSpec(index: number): LabelSpec {
    if (!(index >= 0 && index < labels.length)) {
      throw new Error('Invalid label index: ' + index.toString());
    }
    const label = labels[index];
    if (label == null) {
      throw new Error('Label not found at index: ' + index.toString());
    }
    return label;
  }

  function getCenterForIndex(index: number): number {
    return (
      dataViewMinCoordinate + dataViewWidthOrHeight * getLabelSpec(index).ratio
    );
  }

  function getInterval(label: string, center: number): Interval {
    const dim = labelDimension(label);
    return { max: center + dim / 2, min: center - dim / 2 };
  }
}
