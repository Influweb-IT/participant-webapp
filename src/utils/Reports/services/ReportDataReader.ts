import { ReportData } from "../models/ReportModels";

export function reportDataReader(data: Array<ReportData>) {
  let reportDataObject: any = {};

  data.forEach((el: any) => {
    let value: string | Array<string>;

    // TODO add number
    switch (el.dtype) {
      case "string":
        value = el.value;
        break;
      case "keyList":
        value = el.value.split(";");
        break;
      default:
        value = el.value;
        break;
    }

    reportDataObject[el.key] = value;
  });

  return reportDataObject;
}
