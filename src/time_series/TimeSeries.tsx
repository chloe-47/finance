import * as React from 'react';
import type { Offset } from 'src/measurements/LabelArray';
import useMeasureElement from 'src/measurements/useMeasureElement';
import type {
  TimeSeriesChartDefinitionWithMaybeIncompleteChartSize,
  TimeSeriesChartDefinitionWithViewProps,
} from 'src/time_series/SeriesTypes';
import TimeSeriesDataView from 'src/time_series/TimeSeriesDataView';
import 'src/time_series/TimeSeriesStyles.css';
import TimeSeriesXAxis from 'src/time_series/TimeSeriesXAxis';
import getValueRange, { valueRangeKey } from './getValueRange';
import TimeSeriesYAxis from './TimeSeriesYAxis';

type Props = Readonly<{
  definition: TimeSeriesChartDefinitionWithViewProps;
}>;

export default function TimeSeries({ definition }: Props): JSX.Element {
  const [ready, setReady] = React.useState<boolean>(false);
  const [step, setStep] = React.useState<number | undefined>();
  const valueRange = React.useMemo(() => {
    return getValueRange(definition.seriesData.valuesMinAndMax, step ?? 1);
  }, [valueRangeKey(definition.seriesData.valuesMinAndMax, step)]);
  const [xOffset, setXOffset] = React.useState<Offset | undefined>();
  const [yOffset, setYOffset] = React.useState<Offset | undefined>();
  const { ref: measureXAxisRef, rect: xAxisRect } = useMeasureElement();
  const xAxisHeight = xAxisRect?.height;
  const { ref: measureYAxisRef, rect: yAxisRect } = useMeasureElement({
    debounceZeroes: true,
  });
  const yAxisWidth = yAxisRect?.width;
  const { ref: measureLabelRef, rect: labelRect } = useMeasureElement();
  const labelWidth = labelRect?.width;
  const withoutXAxisHeight = useSubtractHeight(definition, xAxisHeight);
  const dataViewDefinition = useSubtractWidth(
    useSubtractWidth(withoutXAxisHeight, yAxisWidth),
    labelWidth,
  );
  const xAxisDefinition = useSubtractWidthOrUseDefault(
    useSubtractWidthOrUseDefault(definition, yAxisWidth),
    labelWidth,
  );
  React.useEffect(() => {
    setTimeout(() => {
      setReady(step !== undefined);
    });
  }, [step]);

  return (
    <>
      <tr style={ready ? {} : { opacity: 0 }}>
        <td className="label" ref={measureLabelRef}>
          {definition.label}
        </td>
        <td className="y-axis" ref={measureYAxisRef}>
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
            ready={ready}
            valueRange={valueRange}
            xOffset={xOffset}
            yOffset={yOffset}
          />
        </td>
      </tr>
      <tr style={ready ? {} : { opacity: 0 }}>
        <td></td>
        <td></td>
        <td
          ref={measureXAxisRef}
          style={{
            alignItems: 'flex-end',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          <TimeSeriesXAxis
            definition={xAxisDefinition}
            setOffset={setXOffset}
          />
        </td>
      </tr>
      <tr className="spacer"></tr>
    </>
  );
}

function useSubtractHeight(
  definition: TimeSeriesChartDefinitionWithMaybeIncompleteChartSize,
  toSubtract: number | undefined,
): TimeSeriesChartDefinitionWithMaybeIncompleteChartSize {
  return React.useMemo(() => {
    return {
      ...definition,
      chartSize: {
        ...definition.chartSize,
        height:
          toSubtract === undefined || definition.chartSize.height === undefined
            ? undefined
            : definition.chartSize.height - toSubtract,
      },
    };
  }, [definition, toSubtract]);
}

function useSubtractWidth(
  definition: TimeSeriesChartDefinitionWithMaybeIncompleteChartSize,
  toSubtract: number | undefined,
): TimeSeriesChartDefinitionWithMaybeIncompleteChartSize {
  return React.useMemo(() => {
    return {
      ...definition,
      chartSize: {
        ...definition.chartSize,
        width:
          toSubtract === undefined || definition.chartSize.width === undefined
            ? undefined
            : definition.chartSize.width - toSubtract,
      },
    };
  }, [definition, toSubtract]);
}

function useSubtractWidthOrUseDefault(
  definition: TimeSeriesChartDefinitionWithViewProps,
  toSubtract: number | undefined,
): TimeSeriesChartDefinitionWithViewProps {
  return React.useMemo(() => {
    return {
      ...definition,
      chartSize: {
        ...definition.chartSize,
        width: definition.chartSize.width - (toSubtract ?? 0),
      },
    };
  }, [definition, toSubtract]);
}
