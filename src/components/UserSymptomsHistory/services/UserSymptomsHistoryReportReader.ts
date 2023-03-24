import { studyAPI } from "case-web-app-core";
import { Report, ReportData } from "../../../utils/Reports/models/ReportModels";
import { reportDataReader } from "../../../utils/Reports/services/ReportDataReader";
import { ImageBrowserViewModel } from "../../ImageBrowser/models/ImageBrowserViewModel";
import { IImageBrowserDataReader } from "../../ImageBrowser/services/IImageBrowserDataReader";

import symptomsConfig from "../../../configs/symptomsConfig.json";
import { SymptomsResult } from "../models/SymptomsResult";

type ReportRequestParameters = Parameters<typeof studyAPI.getReportsForUser>;

export class UserSymptomsHistoryReportReader implements IImageBrowserDataReader {
  studyId: string;
  profileId: string;
  startingDate: number | undefined = undefined;
  hasMoreData: boolean = true;

  constructor(studyId: string, profileId: string, limit: number) {
    this.studyId = studyId;
    this.profileId = profileId;
  }

  next = async (count: number): Promise<Array<ImageBrowserViewModel>> => {
    let symptomsResults: ImageBrowserViewModel[] = [];

    if (!this.hasMoreData) {
      return symptomsResults;
    }

    const requestParameters: ReportRequestParameters = [
      [this.studyId],
      [this.profileId],
      "symptomsFeedback", // read from shared model
      undefined,
      this.startingDate,
      undefined,
      count,
    ];

    let response;

    try {
      response = await studyAPI.getReportsForUser(...requestParameters);

      if (!response?.data?.reports) {
        return symptomsResults;
      }

      symptomsResults = response.data.reports.map((report: Report) => {
        let viewModel: ImageBrowserViewModel = {
          date: new Date(report.timestamp * 1000).toDateString(),
          // TODO manage default image
          imageUrl: this.reportDataToImage(report.data) ?? "assets/images/feedback/feedback_bene_f_icon.jpg",
        };

        return viewModel;
      });

      // TODO review
    } catch {
      /* empty */
    } finally {
      const reportCount = response?.data?.reports ? response.data.reports.length : 0;
      if (reportCount > 0) {
        this.startingDate = response.data.reports[reportCount - 1].timestamp;
      }

      this.hasMoreData = reportCount === count;
    }

    return symptomsResults;
  };

  // TODO clean and extract
  private reportDataToImage(data: Array<ReportData>) {
    const reportDataObject: SymptomsResult = reportDataReader(data);

    const config: any = symptomsConfig;

    for (let symptoms of config[reportDataObject.gender]) {
      for (let symptom in symptoms) {
        if (reportDataObject.symptoms.includes(symptom)) {
          return symptoms[symptom];
        }
      }
    }
  }
}
