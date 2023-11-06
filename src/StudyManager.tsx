import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InfluwebState } from "./utils/ConfigureState";
import {
  checkUserGroup,
  initializePreselezioneStudy,
  inviteToPreselezioneStudy,
} from "./thunks/preselezioneStudyThunks";
import { RootState } from "@influenzanet/case-web-app-core/build/store/rootReducer";
import {
  initializeStudyGroup,
  inviteToOperatoreStudy,
} from "./thunks/studyGroupThunks";
import { inviteProfileToBambinoStudy } from "./thunks/bambinoStudyThunks";
import { coreReduxActions } from "@influenzanet/case-web-app-core";

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

  // preselezizone study
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

  // study group
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

  // profile
  useEffect(() => {
    if (
      currentUser.id &&
      studyGroup.group === "genitore" &&
      studyGroup.status === "assigned"
    ) {
      dispatch(inviteProfileToBambinoStudy(currentUser));
    }
  }, [dispatch, currentUser, studyGroup.group, studyGroup.status]);

  // TODO remove and properly fix the problem in case web app core

  useEffect(() => {
    if (
      preselezioneStudyStatus === "assigned" ||
      studyGroup.status === "assigned"
    ) {
      dispatch(coreReduxActions.userActions.setUser(currentUser));
    }
  }, [dispatch, currentUser, preselezioneStudyStatus, studyGroup]);

  const instance = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={instance} />
    </>
  );
};

export default StudyManager;
