type Args = (
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

  constructor({ name, ...args }: Args) {
    this.name = name;
    if ('monthlyIncome' in args) {
      this.monthlyIncome = args.monthlyIncome;
    } else {
      this.monthlyIncome = args.annualSalary / 12;
    }
  }
}
