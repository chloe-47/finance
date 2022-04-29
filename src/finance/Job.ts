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
  public readonly monthlyIncome: number;
  public readonly name: string;

  public constructor({ name, ...args }: JobStaticConfig) {
    this.name = name;
    if ('monthlyIncome' in args) {
      this.monthlyIncome = args.monthlyIncome;
    } else {
      this.monthlyIncome = args.annualSalary / 12;
    }
  }

  public static fromStaticConfig(staticConfig: JobStaticConfig): Job {
    return new Job(staticConfig);
  }
}
