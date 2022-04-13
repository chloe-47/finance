import * as React from 'react';
import DateLabel from 'src/dates/DateLabel';
import useMeasurements from 'src/measurements/useMeasurements';

export type Offset = {
  dataViewMinCoordinate: number;
  dataViewMaxCoordinate: number;
  total: number;
};

type Props = {
  labels: Array<string>;
  pointRadius: number;
  setOffset: (offset: Offset) => void;
  width: number;
};

type ProcessedValues = {
  dataViewWidthOrHeight: number;
  dataViewMinCoordinate: number;
  firstLabel: string;
  lastLabel: string;
  dataViewMaxCoordinate: number;
  middleLabels: Array<{ label: string; minCoordinate: number }>;
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
      const { dataViewMinCoordinate, dataViewMaxCoordinate, total } =
        processedValues;
      setOffset({ dataViewMaxCoordinate, dataViewMinCoordinate, total });
    }
  }, [processedValues]);

  if (processedValues == null) {
    return <div />;
  }

  const { firstLabel, lastLabel, middleLabels, total } = processedValues;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        width: total,
      }}
    >
      <div>{firstLabel}</div>
      <div>{lastLabel}</div>
      {middleLabels.map(({ label, minCoordinate }) => {
        return (
          <div
            key={label}
            style={{ left: minCoordinate, position: 'absolute' }}
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

  const firstLabelWidth = labelWidth(firstLabel);
  const lastLabelWidth = labelWidth(lastLabel);

  const spillLeft = Math.max(firstLabelWidth / 2, pointRadius);
  const spillRight = Math.max(lastLabelWidth / 2, pointRadius);

  const dataViewMinCoordinate = spillLeft;
  const dataViewMaxCoordinate = width - spillRight;
  const total = width;

  const dataViewWidthOrHeight = dataViewMaxCoordinate - dataViewMinCoordinate;

  const maxTotalMiddleLabelsWidth =
    dataViewWidthOrHeight - firstLabelWidth / 2 - lastLabelWidth / 2;
  let step = 1;
  for (step = 1; step <= middle.length; step++) {
    const widthRequiredForMiddleLabels =
      computeRequiredWidthForMiddleLabels(step);
    if (widthRequiredForMiddleLabels < maxTotalMiddleLabelsWidth) {
      break;
    }
  }

  const labelsToInclude: Array<{ label: string; index: number }> = [];
  for (let index = step; index < labels.length - 1; index += step) {
    labelsToInclude.push({ index, label: getLabelAtIndex(index) });
  }

  const middleLabels = labelsToInclude.map(({ label, index }) => {
    const center =
      dataViewMinCoordinate +
      dataViewWidthOrHeight * (index / (labels.length - 1));
    const minCoordinate = center - labelWidth(label) / 2;
    return { label, minCoordinate };
  });

  return {
    dataViewMaxCoordinate,
    dataViewMinCoordinate,
    dataViewWidthOrHeight,
    firstLabel,
    lastLabel,
    middleLabels,
    total,
  };

  function labelWidth(label: string): number {
    if (measurements == null) {
      throw new Error(
        'labelWidth should not be called if measurements is null',
      );
    }
    const measurement = measurements.get(label);
    if (measurement == null) {
      throw new Error('measurement is missing for label: ' + label);
    }
    return measurement.width;
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

  function computeRequiredWidthForMiddleLabels(step: number): number {
    let requiredWidth = 0;
    for (let index = step; index < labels.length - 1; index += step) {
      requiredWidth += labelWidth(getLabelAtIndex(index)) + 16;
    }
    return requiredWidth;
  }

  function getLabelAtIndex(index: number): string {
    const label = labels[index];
    if (label == null) {
      throw new Error('Invalid label index: ' + index.toString());
    }
    return label;
  }
}
