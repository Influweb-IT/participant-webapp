import { useSelector } from "react-redux";

import "./UserProfilesSelector.scss";
import React from "react";

interface UserProfilesSelectorProps {
  selectedProfileId: string;
  onProfileChange: any;
  className?: string;
}

const UserProfilesSelector: React.FC<UserProfilesSelectorProps> = (props) => {
  // set the correct type but it must be exported case web app core
  const profiles: Array<any> = useSelector((state: any) => state.user.currentUser.profiles);
  const selectedProfile = profiles.filter((profile) => profile.id === props.selectedProfileId)[0];

  function avatarImg(avatarId: string) {
    if (avatarId === "default") avatarId = "unknown";
    const avatarName = avatarId.charAt(0).toUpperCase() + avatarId.slice(1);
    return `${avatarName}_Bunt.png`;
  }

  const listItems = profiles.map((profile) => {
    const isSelected = profile.id === selectedProfile.id;
    const avatarUri = `assets/avatars/${avatarImg(profile.avatarId)}`;

    return (
      <li
        className={`${isSelected ? "selected" : ""} d-flex flex-wrap align-items-center justify-content-center`}
        key={profile.id}
        onClick={() => props.onProfileChange(profile.id)}
      >
        <img src={avatarUri} alt={profile.alias} title={profile.alias} />
      </li>
    );
  });

  return (
    <div className={`profile-selector ${props.className} p-2 d-flex flex-column align-items-center`}>
      <h5 id="profile_name" className="fw-bold flex-grow">
        {selectedProfile.alias}
      </h5>
      <ul className="d-flex flex-wrap align-items-center justify-content-center">{listItems}</ul>
    </div>
  );
};

UserProfilesSelector.defaultProps = {
  className: "col-lg-4 text-white",
};

export default UserProfilesSelector;