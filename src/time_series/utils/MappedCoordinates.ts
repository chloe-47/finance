import type Date_ from 'src/dates/Date_';
import filterNulls from 'src/utils/filterNulls';
import flatten from 'src/utils/flatten';
import type { Coordinates } from '../createCoordinateMapper';
import type SeriesData from '../SeriesData';
import type { Point } from '../SeriesTypes';
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

type Args = Readonly<{
  getCoordinates: (point: Point) => Coordinates;
  xMax: number;
  xMin: number;
  yMax: number;
  yMin: number;
  seriesData: SeriesData;
}>;

export default class MappedCoordinates {
  private readonly props: Props;
  private constructor(props: Props) {
    this.props = props;
  }

  public static create({
    getCoordinates,
    seriesData,
    xMax,
    xMin,
    yMax,
    yMin,
  }: Args): MappedCoordinates {
    const dateToXPosition: Map<Date_, number> = new Map();
    const allDates = Array.from(
      new Set(
        flatten(
          seriesData.seriesList.map((series) =>
            series.points.map((point) => {
              dateToXPosition.set(point.date, getCoordinates(point).cx);
              return point.date;
            }),
          ),
        ),
      ),
    ).sort((a, b) => a.timestamp() - b.timestamp());
    const sortedDates = allDates.map((date, i: number): DateWithSeriesData => {
      const x = dateToXPosition.get(date) ?? 0;
      const xIntervalMin =
        i === 0
          ? xMin
          : (x + (dateToXPosition.get(allDates[i - 1] ?? date) ?? 0)) / 2;
      const xIntervalMax =
        i === allDates.length - 1
          ? xMax
          : (x + (dateToXPosition.get(allDates[i + 1] ?? date) ?? 0)) / 2;
      const allPointsWithYPositionsSorted = filterNulls(
        seriesData.seriesList.map(
          (series): { yPos: number; point: Point; label: string } | null => {
            const pointForDate = series.points.find(
              ({ date: date_ }) => date_ === date,
            );
            if (pointForDate === undefined) {
              return null;
            }
            return {
              label: series.label,
              point: pointForDate,
              yPos: getCoordinates(pointForDate).cy,
            };
          },
        ),
      ).sort((a, b) => a.yPos - b.yPos);
      const sortedSeries = allPointsWithYPositionsSorted.map(
        ({ point, label, yPos: y }, i): SeriesPointWithYPosition => {
          const yIntervalMin =
            i === 0
              ? yMin
              : (y + (allPointsWithYPositionsSorted[i - 1]?.yPos ?? 0)) / 2;
          const yIntervalMax =
            i === allPointsWithYPositionsSorted.length - 1
              ? yMax
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
    });
    return new MappedCoordinates({ sortedDates });
  }

  snap(
    hoverCoordinates: HoverCoordinates | undefined,
  ): HoverCoordinates | undefined {
    if (hoverCoordinates === undefined) {
      return undefined;
    }
    const { x: rawX, y: rawY } = hoverCoordinates;
    const { sortedDates } = this.props;
    for (const { x, sortedSeries, xInterval } of sortedDates) {
      if (xInterval.min <= rawX && rawX <= xInterval.max) {
        for (const { y, yInterval } of sortedSeries) {
          if (yInterval.min <= rawY && rawY <= yInterval.max) {
            return { x, y };
          }
        }
      }
    }
    return undefined;
  }
}
