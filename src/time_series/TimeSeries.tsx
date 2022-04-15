import * as React from 'react';
import type { Offset } from 'src/measurements/LabelArray';
import useMeasureElement from 'src/measurements/useMeasureElement';
import type {
  TimeSeriesChartDefinition,
  TimeSeriesChartDefinitionWithMaybeIncompleteChartSize,
} from 'src/time_series/SeriesTypes';
import TimeSeriesDataView from 'src/time_series/TimeSeriesDataView';
import 'src/time_series/TimeSeriesStyles.css';
import TimeSeriesXAxis from 'src/time_series/TimeSeriesXAxis';
import getValueRange, { valueRangeKey } from './getValueRange';
import TimeSeriesYAxis from './TimeSeriesYAxis';

type Props = {
  definition: TimeSeriesChartDefinition;
};

export default function TimeSeries({ definition }: Props): JSX.Element {
  const [ready, setReady] = React.useState<boolean>(false);
  const [step, setStep] = React.useState<number | undefined>();
  const valueRange = React.useMemo(
    () => getValueRange(definition.seriesList, step ?? 1),
    [valueRangeKey(definition.seriesList, step)],
  );
  const [xOffset, setXOffset] = React.useState<Offset | undefined>();
  const [yOffset, setYOffset] = React.useState<Offset | undefined>();
  const { ref: measureXAxisRef, height: xAxisHeight } = useMeasureElement();
  const { ref: measureYAxisRef, width: yAxisWidth } = useMeasureElement({
    debounceZeroes: true,
  });
  const withoutXAxisHeight = useSubtractHeight(definition, xAxisHeight);
  const dataViewDefinition = useSubtractWidth(withoutXAxisHeight, yAxisWidth);
  const xAxisDefinition = useSubtractWidthOrUseDefault(definition, yAxisWidth);
  React.useEffect(() => {
    setTimeout(() => setReady(step !== undefined));
  }, [step]);

  return (
    <table className="TimeSeries" style={!ready ? { opacity: 0 } : {}}>
      <tbody>
        <tr>
          <td ref={measureYAxisRef}>
            <TimeSeriesYAxis
              definition={withoutXAxisHeight}
              setOffset={setYOffset}
              setStep={setStep}
              valueRange={valueRange}
            />
          </td>
          <td>
            <TimeSeriesDataView
              definition={dataViewDefinition}
              valueRange={valueRange}
              xOffset={xOffset}
              yOffset={yOffset}
            />
          </td>
        </tr>
        <tr ref={measureXAxisRef}>
          <td></td>
          <TimeSeriesXAxis
            definition={xAxisDefinition}
            setOffset={setXOffset}
          />
        </tr>
      </tbody>
    </table>
  );
}

function useSubtractHeight(
  definition: TimeSeriesChartDefinitionWithMaybeIncompleteChartSize,
  toSubtract: number | undefined,
): TimeSeriesChartDefinitionWithMaybeIncompleteChartSize {
  return React.useMemo(
    () => ({
      ...definition,
      chartSize: {
        ...definition.chartSize,
        height:
          toSubtract === undefined || definition.chartSize.height === undefined
            ? undefined
            : definition.chartSize.height - toSubtract,
      },
    }),
    [definition, toSubtract],
  );
}

function useSubtractWidth(
  definition: TimeSeriesChartDefinitionWithMaybeIncompleteChartSize,
  toSubtract: number | undefined,
): TimeSeriesChartDefinitionWithMaybeIncompleteChartSize {
  return React.useMemo(
    () => ({
      ...definition,
      chartSize: {
        ...definition.chartSize,
        width:
          toSubtract === undefined || definition.chartSize.width === undefined
            ? undefined
            : definition.chartSize.width - toSubtract,
      },
    }),
    [definition, toSubtract],
  );
}

function useSubtractWidthOrUseDefault(
  definition: TimeSeriesChartDefinition,
  toSubtract: number | undefined,
): TimeSeriesChartDefinition {
  return React.useMemo(
    () => ({
      ...definition,
      chartSize: {
        ...definition.chartSize,
        width: definition.chartSize.width - (toSubtract ?? 0),
      },
    }),
    [definition, toSubtract],
  );
}
