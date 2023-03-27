import React, { useRef } from "react";
import ImageBrowser from "../ImageBrowser/ImageBrowser";
import { IImageBrowserDataReader } from "../ImageBrowser/services/IImageBrowserDataReader";

interface ProfileSymptomsHistoryProps {
  studyId: string;
  profileId: string;
  className?: string;
  dataReaderFactory: (studyId: string, profileId: string, limit: number) => IImageBrowserDataReader;
  enableAnimations?: boolean;
}

const ProfileSymptomsHistory: React.FC<ProfileSymptomsHistoryProps> = (props) => {
  return (
    <SymptomsHistory
      studyId={props.studyId}
      profileId={props.profileId}
      className={props.className}
      enableAnimations={props.enableAnimations}
      dataReaderFactory={props.dataReaderFactory}
      key={props.studyId + props.profileId}
    />
  );
};

const SymptomsHistory: React.FC<ProfileSymptomsHistoryProps> = (props) => {
  const dataReader = useRef(props.dataReaderFactory(props.studyId, props.profileId, 5));

  return (
    <ImageBrowser
      className={props.className}
      enableAnimations={props.enableAnimations}
      dataReader={dataReader.current}
    ></ImageBrowser>
  );
};

ProfileSymptomsHistory.defaultProps = {
  className: "col-lg-8 text-white bg-primary",
  enableAnimations: true,
};

export default ProfileSymptomsHistory;
