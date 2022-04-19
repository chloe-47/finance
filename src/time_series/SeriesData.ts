import computeValuesMinAndMax from './models/computeValuesMinAndMax';
import type { Series } from './SeriesTypes';
import type { ValuesMinAndMax } from './ValuesMinAndMax';

export default class SeriesData {
  seriesList: ReadonlyArray<Series>;
  valuesMinAndMax: ValuesMinAndMax;

  constructor(seriesList: ReadonlyArray<Series>) {
    this.seriesList = seriesList;
    this.valuesMinAndMax = computeValuesMinAndMax(seriesList);
    Object.freeze(this);
  }
}
