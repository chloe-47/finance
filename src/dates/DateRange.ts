import Date_ from './Date_';

export default class DateRange {
  readonly dates: ReadonlyArray<Date_>;
  readonly labels: ReadonlyArray<LabelSpec>;
  readonly minTimestamp: number;
  readonly maxTimestamp: number;

  constructor(start_: Date_, end_: Date_) {
    const dates = [];
    const start = start_.floorMonth();
    const end = end_.floorMonth();
    for (let d = start; d.timestamp() <= end.timestamp(); d = d.addMonths(1)) {
      dates.push(d);
    }
    Object.freeze(dates);
    this.dates = dates;

    this.minTimestamp = start.timestamp();
    this.maxTimestamp = end.timestamp();
    const labels: Array<LabelSpec> = [];
    const thisMonth = Date_.now().floorMonth().timestamp();
    this.dates.forEach((date: Date_): void => {
      if (date.timestamp() === thisMonth) {
        labels.push({
          label: 'Now',
          ratio: 0,
        });
      } else if (date.date.getMonth() === 1) {
        labels.push({
          label: date.date.getFullYear().toString(),
          ratio:
            (date.timestamp() - this.minTimestamp) /
            (this.maxTimestamp - this.minTimestamp),
        });
      }
    });
    this.labels = labels;
    Object.freeze(this);
  }

  static nextYears(years: number): DateRange {
    return new DateRange(Date_.now(), Date_.now().addYears(years));
  }
}

export type LabelSpec = Readonly<{
  label: string;
  // Number between 0 and 1 indicating how far through the range it is
  ratio: number;
}>;
