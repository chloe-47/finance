import type { Series } from 'src/chart/time_series/SeriesTypes';
import getAllDates from './getAllDates';
import getDateLabel from './getDateLabel';

export default function getAllDateLabels(
  seriesList: Array<Series>,
): Array<string> {
  return getAllDates(seriesList).map(getDateLabel);
}
