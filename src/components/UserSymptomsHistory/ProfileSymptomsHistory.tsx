import React, { useRef } from "react";
import ImageBrowser from "../ImageBrowser/ImageBrowser";
import { UserSymptomsHistoryReportReader } from "./services/UserSymptomsHistoryReportReader";

interface ProfileSymptomsHistoryProps {
  studyId: string;
  profileId: string;
  className?: string;
  enableAnimations?: boolean;
}

const ProfileSymptomsHistory: React.FC<ProfileSymptomsHistoryProps> = (props) => {
  return (
    <SymptomsHistory
      studyId={props.studyId}
      profileId={props.profileId}
      className={props.className}
      enableAnimations={props.enableAnimations}
      key={props.studyId + props.profileId}
    />
  );
};

// TODO data reader not easily replaceable like this
const SymptomsHistory: React.FC<ProfileSymptomsHistoryProps> = (props) => {
  const dataReader = useRef(new UserSymptomsHistoryReportReader(props.studyId, props.profileId, 5));

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
