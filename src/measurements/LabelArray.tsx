import * as React from 'react';
import DateLabel from 'src/dates/DateLabel';
import useMeasurements from 'src/measurements/useMeasurements';

export type Offset = {
  min: number;
  max: number;
  total: number;
};

type Props = {
  labels: Array<string>;
  pointRadius: number;
  setOffset: (offset: Offset) => void;
  width: number;
};

type ProcessedValues = {
  firstLabel: string;
  lastLabel: string;
  max: number;
  middle: string[];
  min: number;
  total: number;
};

export default function LabelArray({
  labels,
  pointRadius,
  setOffset,
  width,
}: Props): JSX.Element {
  const measurements = useMeasurements({
    render: (val: string): JSX.Element => <DateLabel label={val} />,
    valToString: (v) => v,
    values: labels,
  });

  const processedValues = React.useMemo((): ProcessedValues | undefined => {
    return getProcessedValues({
      labels,
      measurements,
      pointRadius,
      width,
    });
  }, [labels, pointRadius, width, measurements]);

  React.useEffect(() => {
    if (processedValues != null) {
      const { min, max, total } = processedValues;
      setOffset({ max, min, total });
    }
  }, [processedValues]);

  if (processedValues == null) {
    return <div />;
  }

  const { firstLabel, lastLabel, total } = processedValues;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: total,
      }}
    >
      <div>{firstLabel}</div>
      <div>{lastLabel}</div>
    </div>
  );
}

type GetProcessedValuesArgs = Omit<Props, 'setOffset'> & {
  measurements: ReturnType<typeof useMeasurements>;
};

function getProcessedValues({
  labels,
  pointRadius,
  width,
  measurements,
}: GetProcessedValuesArgs): ProcessedValues | undefined {
  if (measurements == null) {
    return undefined;
  }

  if (labels.length < 2) {
    throw new Error(
      'LabelArray does not support lists of fewer than 2 elements',
    );
  }

  const firstLabel = getLabel(0);
  const lastLabel = getLabel(labels.length - 1);
  const middle = labels.slice(1, labels.length - 1);
  middle;

  const firstWidth = labelWidth(firstLabel);
  const lastWidth = labelWidth(lastLabel);

  const spillLeft = Math.max(firstWidth / 2, pointRadius);
  const spillRight = Math.max(lastWidth / 2, pointRadius);

  const min = spillLeft;
  const max = width - spillRight;
  const total = width;

  return {
    firstLabel,
    lastLabel,
    max,
    middle,
    min,
    total,
  };

  function labelWidth(label: string): number {
    return measurements?.get(label)?.width ?? 0;
  }

  function getLabel(index: number): string {
    if (!(index >= 0 && index < labels.length)) {
      throw new Error('Invalid label index: ' + index.toString());
    }
    const label = labels[index];
    if (label == null) {
      throw new Error('Label not found at index: ' + index.toString());
    }
    return label;
  }
}
