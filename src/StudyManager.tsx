import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InfluwebState } from "./utils/ConfigureState";
import {
  checkUserGroup,
  initializePreselezioneStudy,
  inviteToPreselezioneStudy,
} from "./thunks/preselezioneStudyThunks";
import { RootState } from "case-web-app-core/build/store/rootReducer";
import {
  initializeStudyGroup,
  inviteToOperatoreStudy,
} from "./thunks/studyGroupThunks";

const StudyManager: React.FC = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const preselezioneStudyStatus = useSelector(
    (state: InfluwebState) => state.preselezioneStudy.status
  );

  const surveyMode = useSelector(
    (state: RootState) => state.app.surveyMode.active
  );

  const studyGroup = useSelector((state: InfluwebState) => state.studyGroup);

  useEffect(() => {
    if (preselezioneStudyStatus === "unassigned" && currentUser) {
      dispatch(initializePreselezioneStudy(currentUser));
    }

    if (preselezioneStudyStatus === "pending_invitation") {
      dispatch(inviteToPreselezioneStudy(currentUser));
    }

    if (preselezioneStudyStatus === "assigned" && !surveyMode) {
      dispatch(checkUserGroup(currentUser));
    }
  }, [dispatch, currentUser, preselezioneStudyStatus, surveyMode]);

  useEffect(() => {
    if (!studyGroup.group) {
      dispatch(initializeStudyGroup(currentUser));
    }

    if (
      studyGroup.group === "operatore" &&
      studyGroup.status === "pending_invitation"
    ) {
      dispatch(inviteToOperatoreStudy(currentUser));
    }
  }, [dispatch, studyGroup, currentUser]);

  const instance = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={instance} />
    </>
  );
};

export default StudyManager;
