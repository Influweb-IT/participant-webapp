import { UserSymptomsHistoryReportReader } from "./UserSymptomsHistoryReportReader";

function UserSymptomsReaderFactory(studyId: string, profileId: string, limit: number) {
  return new UserSymptomsHistoryReportReader(studyId, profileId, limit);
}

export default UserSymptomsReaderFactory;
