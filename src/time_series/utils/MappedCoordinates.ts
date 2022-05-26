import type Date_ from 'src/dates/Date_';
import filterNulls from 'src/utils/filterNulls';
import type { Coordinates } from '../createCoordinateMapper';
import type {
  Point,
  TimeSeriesChartDefinitionWithViewProps,
} from '../SeriesTypes';
import type { HoverCoordinates } from './HoverCoordinatesType';

type Props = Readonly<{
  sortedDates: ReadonlyArray<DateWithSeriesData>;
}>;

type DateWithSeriesData = Readonly<{
  date: Date_;
  x: number;
  sortedSeries: ReadonlyArray<SeriesPointWithYPosition>;
  xInterval: Interval;
}>;

type SeriesPointWithYPosition = Readonly<{
  y: number;
  label: string;
  value: number;
  yInterval: Interval;
}>;

type Interval = {
  min: number;
  max: number;
};

export type HoverContentsRenderData = Readonly<{
  point: Point;
  label: string;
}>;

type SnapReturnData = Readonly<{
  hoverCoordinates: HoverCoordinates;
  hoverContentsRenderData: HoverContentsRenderData;
}>;

type Args = Readonly<{
  getCoordinates: (point: Point) => Coordinates;
  definition: TimeSeriesChartDefinitionWithViewProps;
}>;

export default class MappedCoordinates {
  private readonly props: Props;
  private constructor(props: Props) {
    this.props = props;
  }

  public static createMappedCoordinates({
    getCoordinates,
    definition,
  }: Args): MappedCoordinates {
    const datesWithXPositions = definition.dateRange.dates.map((date) => ({
      date,
      xPosition: getCoordinates({ date, value: 0 }).cx,
    }));
    const { seriesData } = definition;
    const sortedDates = datesWithXPositions.map(
      function mapCoordinatesForOneDate(
        { date, xPosition: x },
        i: number,
      ): DateWithSeriesData {
        const xIntervalMin =
          i === 0
            ? -Infinity
            : (x + (datesWithXPositions[i - 1]?.xPosition ?? 0)) / 2;
        const xIntervalMax =
          i === datesWithXPositions.length - 1
            ? Infinity
            : (x + (datesWithXPositions[i + 1]?.xPosition ?? 0)) / 2;
        const allPointsWithYPositionsSorted = filterNulls(
          seriesData.seriesList.map(function getCoordinatesForOneSeries(
            series,
          ): { yPos: number; point: Point; label: string } | null {
            const pointForDate = series.points[i];
            if (
              pointForDate === undefined ||
              pointForDate.date.valueOf() !== date.valueOf()
            ) {
              throw new Error('Series missing point for date');
            }
            return {
              label: series.label,
              point: pointForDate,
              yPos: getCoordinates(pointForDate).cy,
            };
          }),
        ).sort((a, b) => a.yPos - b.yPos);
        const sortedSeries = allPointsWithYPositionsSorted.map(
          ({ point, label, yPos: y }, i): SeriesPointWithYPosition => {
            const yIntervalMin =
              i === 0
                ? -Infinity
                : (y + (allPointsWithYPositionsSorted[i - 1]?.yPos ?? 0)) / 2;
            const yIntervalMax =
              i === allPointsWithYPositionsSorted.length - 1
                ? Infinity
                : (y + (allPointsWithYPositionsSorted[i + 1]?.yPos ?? 0)) / 2;
            return {
              label,
              value: point.value,
              y,
              yInterval: { max: yIntervalMax, min: yIntervalMin },
            };
          },
        );

        return {
          date,
          sortedSeries,
          x,
          xInterval: { max: xIntervalMax, min: xIntervalMin },
        };
      },
    );
    return new MappedCoordinates({ sortedDates });
  }

  snap(hoverCoordinates: HoverCoordinates): SnapReturnData {
    const { x: rawX, y: rawY } = hoverCoordinates;
    const { sortedDates } = this.props;
    for (const { x, sortedSeries, xInterval, date } of sortedDates) {
      if (xInterval.min <= rawX && rawX <= xInterval.max) {
        for (const { y, yInterval, value, label } of sortedSeries) {
          if (yInterval.min <= rawY && rawY <= yInterval.max) {
            return {
              hoverContentsRenderData: {
                label,
                point: {
                  date,
                  value,
                },
              },
              hoverCoordinates: { x, y },
            };
          }
        }
      }
    }
    throw new Error('Expected to find matching interval');
  }
}
