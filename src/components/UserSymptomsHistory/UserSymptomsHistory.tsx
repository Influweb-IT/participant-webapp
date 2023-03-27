import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import ProfileSymptomsHistory from "./ProfileSymptomsHistory";
import UserProfilesSelector from "../UserProfilesSelector/UserProfilesSelector";

interface UserSymptomsHistoryProps {
  className?: string;
  dataReaderFactoryName: string;
}

const UserSymptomsHistory: React.FC<UserSymptomsHistoryProps> = (props) => {
  const profiles: Array<any> = useSelector((state: any) => state.user.currentUser.profiles);
  const mainProfileId = profiles.filter((profile) => profile.mainProfile)[0].id;
  const studyId = "influweb";

  const [selectedProfileId, setSelectedProfileId] = useState(mainProfileId);
  const [dataReaderFactory, setDataReaderFactory] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // TODO define the base dir
    import("./services/" + props.dataReaderFactoryName).then((v) => {
      if (isMounted) {
        if (typeof v.default === "function") {
          setDataReaderFactory(() => v.default);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [props.dataReaderFactoryName]);

  if (dataReaderFactory !== null) {
    return (
      <div className={props.className}>
        <UserProfilesSelector selectedProfileId={selectedProfileId} onProfileChange={setSelectedProfileId} />
        <ProfileSymptomsHistory
          studyId={studyId}
          profileId={selectedProfileId}
          dataReaderFactory={dataReaderFactory}
        ></ProfileSymptomsHistory>
      </div>
    );
  } else {
    return <></>;
  }
};

UserSymptomsHistory.defaultProps = {
  className: "row g-0 bg-primary",
  dataReaderFactoryName: "UserSymptomsReaderFactory",
};

export default UserSymptomsHistory;
