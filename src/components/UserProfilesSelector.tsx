import React from 'react';
import { useSelector } from 'react-redux';

interface UserProfilesSelectorProps {
  selectedProfileId: string
}

const UserProfilesSelector: React.FC<UserProfilesSelectorProps> = (props) => {

  // set the correct type but it must be exported case web app core
  const profiles = useSelector((state: any) => state.user.currentUser.profiles);

  return (
    <></>
  );
};

export default UserProfilesSelector;

