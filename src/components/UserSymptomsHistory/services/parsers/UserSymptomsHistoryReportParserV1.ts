import { ImageBrowserViewModel } from "../../../ImageBrowser/models/ImageBrowserViewModel";
import IUserSymptomsHistoryReportParser from "../../models/IUserSymptomsHistoryReportParser";
import { SymptomsResult } from "../../models/SymptomsResult";
import symptomsConfig from "../../../../configs/symptomsConfig.json";
import { ParsedReport } from "../../../../utils/Reports/models/ReportModels";

class UserSymptomsHistoryReportParserV1 implements IUserSymptomsHistoryReportParser {
  version: string = "v1";

  parse = (report: ParsedReport) => {
    let viewModel: ImageBrowserViewModel = {
      date: report.timestamp,
      imageUrl: this.reportDataToImage(report.parsedData as SymptomsResult),
    };

    return viewModel;
  };

  private reportDataToImage(data: SymptomsResult) {
    const config: any = symptomsConfig;
    const genderConfig = config[data.gender];

    for (const symptoms of genderConfig) {
      for (const symptom in symptoms) {
        if (data.symptoms.includes(symptom)) {
          return symptoms[symptom];
        }
      }
    }

    const defaultSymptom = genderConfig.find((element: any) => element.hasOwnProperty("default"));
    if (defaultSymptom) {
      return defaultSymptom["default"];
    }
  }
}

export default UserSymptomsHistoryReportParserV1;
