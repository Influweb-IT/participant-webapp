import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import ProfileSymptomsHistory from "./ProfileSymptomsHistory";
import UserProfilesSelector from "./UserProfilesSelector";

interface UserSymptomsHistoryProps {
  className?: string;
}

const UserSymptomsHistory: React.FC<UserSymptomsHistoryProps> = (props) => {
  const profiles: Array<any> = useSelector((state: any) => state.user.currentUser.profiles);
  const mainProfileId = profiles.filter((profile) => profile.mainProfile)[ 0 ].alias;
  const studyId = "influweb";

  const [ selectedProfileId, setSelectedProfileId ] = useState(mainProfileId);

  return (
    <div className={props.className}>
      <UserProfilesSelector selectedProfileId={selectedProfileId} onProfileChange={setSelectedProfileId} />
      <ProfileSymptomsHistory studyId={studyId} profileId={selectedProfileId} />
    </div>
  );
};

UserSymptomsHistory.defaultProps = {
  className: "row g-0 bg-primary"
}

export default UserSymptomsHistory;
