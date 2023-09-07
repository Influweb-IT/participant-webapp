import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import UserProfilesSelector from "../UserProfilesSelector/UserProfilesSelector";
import ImageBrowser from "../ImageBrowser/ImageBrowser";
import { ImageBrowserDataReader } from "../ImageBrowser/services/ImageBrowserDataReader";
import { UserSymptomsHistoryReportReader } from "./services/UserSymptomsHistoryReportReader";

export type DateLocales = Array<{ code: string; locale: any; format: string }>;

export type UserSymptomsHistoryDataReader = new (studyId: string, profileId: string) => ImageBrowserDataReader;

export type UserSymptomsHistoryProps = {
  className?: string;
  studyId: string;
  DataReader?: UserSymptomsHistoryDataReader;
};

const UserSymptomsHistory: React.FC<UserSymptomsHistoryProps> = (props) => {
  return <UserSymptomsHistoryImpl {...props} key={props.studyId}></UserSymptomsHistoryImpl>;
};

const UserSymptomsHistoryImpl: React.FC<UserSymptomsHistoryProps> = (props) => {
  const DataReaderType = props.DataReader ?? UserSymptomsHistoryReportReader;

  const profiles: Array<any> = useSelector((state: any) => state.user.currentUser.profiles);
  const mainProfileId: string = profiles.filter((profile) => profile.mainProfile)[0].id;

  const [selectedProfileId, setSelectedProfileId] = useState(mainProfileId);

  const [dataReader, setDataReader] = useState(new DataReaderType(props.studyId, selectedProfileId));

  return (
    <div className={props.className}>
      <UserProfilesSelector
        selectedProfileId={selectedProfileId}
        onProfileChange={(profileId: string) => {
          setSelectedProfileId(profileId);
          setDataReader(new DataReaderType(props.studyId, profileId));
        }}
      />
      <ImageBrowser dataReader={dataReader} key={selectedProfileId}></ImageBrowser>
    </div>
  );
};

export default UserSymptomsHistory;
