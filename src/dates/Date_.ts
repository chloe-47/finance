export default class Date_ {
  date: Readonly<Date>;

  constructor(d: Date) {
    const date = new Date(d.valueOf());
    Object.freeze(date);
    this.date = date;
    Object.freeze(this);
  }

  asMutable(): Date {
    return new Date(this.date.valueOf());
  }

  floorMonth(): Date_ {
    const date = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    return new Date_(date);
  }

  timestamp(): number {
    return this.date.valueOf();
  }

  valueOf(): number {
    return this.date.valueOf();
  }

  addMonths(deltaMonths: number): Date_ {
    const date = this.asMutable();
    date.setMonth(date.getMonth() + deltaMonths);
    return new Date_(date);
  }

  addYears(deltaYears: number): Date_ {
    const date = this.asMutable();
    date.setFullYear(date.getFullYear() + deltaYears);
    return new Date_(date);
  }

  static now(): Date_ {
    return new Date_(new Date());
  }
}
