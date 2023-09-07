import { ImageBrowserViewModel } from "../../../ImageBrowser/models/ImageBrowserViewModel";
import IUserSymptomsHistoryReportParser from "../../models/IUserSymptomsHistoryReportParser";
import { SymptomsResult } from "../../models/SymptomsResult";
import symptomsConfig from "../../../../configs/symptomsConfig.json";
import { ParsedReport } from "../../../../utils/Reports/models/ReportModels";

class UserSymptomsHistoryReportParserV1 implements IUserSymptomsHistoryReportParser {
  version: string = "v1";

  parse = (report: ParsedReport) => {
    let viewModel: ImageBrowserViewModel = {
      date: new Date(report.timestamp * 1000).toDateString(),
      // TODO manage default image
      imageUrl:
        this.reportDataToImage(report.parsedData as SymptomsResult) ??
        "assets/images/feedback/feedback_bene_f_icon.jpg",
    };

    return viewModel;
  };

  private reportDataToImage(data: SymptomsResult) {
    const config: any = symptomsConfig;

    // we need to loop through the config first because
    // it's where we define the priority for the image being shown
    // when multiple symptoms are present in the repo

    for (let symptoms of config[data.gender]) {
      for (let symptom in symptoms) {
        if (data.symptoms.includes(symptom)) {
          return symptoms[symptom];
        }
      }
    }
  }
}

export default UserSymptomsHistoryReportParserV1;
