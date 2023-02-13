import React from 'react';
import { useState } from 'react';
import ProfileSymptomsHistory from './ProfileSymptomsHistory';
import UserProfilesSelector from './UserProfilesSelector';

const UserSymptomsHistory: React.FC = () => {

  // set to the main profile id at first render
  const [selectedProfileId, setSelectedProfileId] = useState('');

  return (
    <>
      <UserProfilesSelector
        selectedProfileId={selectedProfileId}
      />
      <ProfileSymptomsHistory
        studyId='influweb'
        profileId={selectedProfileId}
      />
    </>
  )
}

export default UserSymptomsHistory;
