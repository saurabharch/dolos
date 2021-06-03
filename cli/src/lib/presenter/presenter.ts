import { Options } from "../util/options";
import { Report } from "../analyze/report";

export abstract class Presenter {
  protected constructor(protected report: Report, protected options: Options) {}

  public abstract present(): Promise<void>;
}
