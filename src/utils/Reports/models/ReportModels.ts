export interface Report {
  key: string;
  timestamp: number;
  data: Array<ReportData>;
}

export interface ReportData {
  key: string;
  value: string;
  dtype: string;
}
