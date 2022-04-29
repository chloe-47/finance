export type JobStaticConfig = (
  | {
      annualSalary: number;
    }
  | {
      monthlyIncome: number;
    }
) & {
  name: string;
};

export default class Job {
  monthlyIncome: number;
  name: string;

  constructor({ name, ...args }: JobStaticConfig) {
    this.name = name;
    if ('monthlyIncome' in args) {
      this.monthlyIncome = args.monthlyIncome;
    } else {
      this.monthlyIncome = args.annualSalary / 12;
    }
  }
}
