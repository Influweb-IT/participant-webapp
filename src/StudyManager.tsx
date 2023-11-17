import React, { useEffect } from "react";
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
    if (preselezioneStudyStatus === "unassigned" && currentUser.id) {
      dispatch(initializePreselezioneStudy(currentUser));
    }

    if (preselezioneStudyStatus === "pending_invitation" && currentUser.id) {
      dispatch(inviteToPreselezioneStudy(currentUser));
    }

    if (
      preselezioneStudyStatus === "assigned" &&
      !surveyMode &&
      currentUser.id
    ) {
      dispatch(checkUserGroup(currentUser));
    }
  }, [dispatch, currentUser, preselezioneStudyStatus, surveyMode]);

  // study group
  useEffect(() => {
    if (!studyGroup.group && currentUser.id) {
      dispatch(initializeStudyGroup(currentUser));
    }

    if (
      studyGroup.group === "operatore" &&
      studyGroup.status === "pending_invitation" &&
      currentUser.id
    ) {
      dispatch(inviteToOperatoreStudy(currentUser));
    }
  }, [dispatch, studyGroup, currentUser]);

  // profile
  useEffect(() => {
    if (
      currentUser.id &&
      studyGroup.group === "genitore" &&
      studyGroup.status === "assigned" &&
      currentUser.id
    ) {
      dispatch(inviteProfileToBambinoStudy(currentUser));
    }
  }, [dispatch, currentUser, studyGroup.group, studyGroup.status]);

  return <></>;
};

export default StudyManager;
