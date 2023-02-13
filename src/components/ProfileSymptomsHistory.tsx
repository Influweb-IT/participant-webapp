import React, { useEffect, useState } from 'react';
import { studyAPI } from 'case-web-app-core';

interface ProfileSymptomsHistoryProps {
  studyId: string,
  profileId: string
}

type ReportRequestParameters = Parameters<typeof studyAPI.getReportsForUser>;

const ProfileSymptomsHistory: React.FC<ProfileSymptomsHistoryProps> = (props) => {

  const [index, setIndex] = useState(0);
  const [reports, setReports] = useState([]); // add type
  const prev = function() {

  };
  const next = function() {

  };

  useEffect(() => {

    const getSymptoms = async (startingDate: number | undefined = undefined) => {

    const requestParameters: ReportRequestParameters = [
      [props.studyId],
      [props.profileId],
      "symptomsFeedback", // read from shared model
      undefined,
      startingDate,
      undefined,
      5
    ];

      try {
        const response = await studyAPI.getReportsForUser(...requestParameters);

        console.log(response);
      }
      catch {

      }
      finally {

      }
    };

    getSymptoms();

  }, [props.studyId, props.profileId]);

  return <></>;
};

export default ProfileSymptomsHistory;
