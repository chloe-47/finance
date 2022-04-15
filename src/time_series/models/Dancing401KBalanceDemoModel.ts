import addMonths from 'src/dates/addMonths';
import type { Point, Series, TimeSeriesChartDefinition } from '../SeriesTypes';
import createModel from './createModel';
import type { TimeSeriesModel } from './TimeSeriesModel';

export default function Dancing401KBalanceDemoModel(): TimeSeriesModel {
  const { update, model } = createModel({
    initial: getInitialState(),
  });

  setInterval(() => update(updater), 300);

  return model;

  function getInitialState(): TimeSeriesChartDefinition {
    return {
      chartSize: {
        height: 400,
        pointRadius: 4,
        width: 600,
      },
      seriesList: [
        {
          label: '401k balance',
          points: [
            142000, 144500, 147500, 151000, 155000, 142000, 129000, 119000,
            112000, 105000, 105500, 106500, 108000, 109000, 111000, 115000,
            115000, 242000, 144500, 147500, 151000, 155000, 142000, 129000,
            119000, 112000, 105000, 105500, 106500, 108000, 109000, 111000,
            115000, 115000, 115000, 242000, 144500, 147500, 151000, 155000,
            142000, 129000, 119000, 112000, 105000, 105500, 106500, 108000,
            109000, 111000, 115000, 115000,
          ].map(
            (value: number, index): Point => ({
              date: addMonths(new Date(), index),
              value,
            }),
          ),
        },
      ],
    };
  }

  function updater(
    value: TimeSeriesChartDefinition,
  ): TimeSeriesChartDefinition {
    const { seriesList, ...rest } = value;
    const updatedSeriesList = seriesList.map(fuzzSeries);
    return { seriesList: updatedSeriesList, ...rest };
  }
}

function fuzzSeries({ points, ...rest }: Series): Series {
  const fuzzFactors = points.map(fuzzFactor);
  const updatedPoints = points.map(
    ({ value, ...pointRest }: Point, index: number): Point => {
      if (Math.random() < 0.2) {
        return {
          value: fuzzValue(value, fuzzFactors, index, points),
          ...pointRest,
        };
      } else {
        return {
          value,
          ...pointRest,
        };
      }
    },
  );
  return { points: updatedPoints, ...rest };
}

function fuzzValue(
  value: number,
  fuzzFactors: number[],
  index: number,
  points: Point[],
): number {
  const prev2 = fuzzFactors[index - 2] ?? 0;
  const prev1 = fuzzFactors[index - 1] ?? 0;
  const this_ = fuzzFactors[index] ?? 0;
  const next1 = fuzzFactors[index + 1] ?? 0;
  const next2 = fuzzFactors[index + 2] ?? 0;

  const adjPointM2 = pullDistance(points[index - 2]?.value ?? value, value);
  const adjPointM1 = pullDistance(points[index - 1]?.value ?? value, value);
  const adjPointP2 = pullDistance(points[index + 2]?.value ?? value, value);
  const adjPointP1 = pullDistance(points[index + 1]?.value ?? value, value);

  const smoothed =
    Math.pow(this_, 2) * (this_ < 0 ? -1 : 1) * 2 +
    next1 * 0.5 +
    prev1 * 0.5 +
    next2 * 0.25 +
    prev2 * 0.25;
  const pulled = adjPointM1 * adjPointP1 * adjPointM2 * adjPointP2;

  const factor = (1 + 0.15 * smoothed) * pulled;
  return value * factor;
}

function fuzzFactor(): number {
  return Math.random() - 0.5;
}

function pullDistance(other: number, value: number): number {
  // Other is 120, value is 100
  // (120 - 100) / 100 = 0.2
  // Other is 80, value is 100
  // (80 - 100) / 100 = -0.2
  const distanceRatio = (other - value) / Math.max(value, other);
  const flattened = Math.pow(distanceRatio, 2) * (distanceRatio < 0 ? -1 : 1);
  if (flattened === 1) {
    return 1;
  }
  return 1 + Math.max(-0.99, flattened);
}
