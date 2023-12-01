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
import { inviteProfilesToBambinoStudy } from "./thunks/bambinoStudyThunks";
import {
  GENITORE_GROUP,
  OPERATORE_GROUP,
  STATUS_ASSIGNED,
  STATUS_COMPLETED,
  STATUS_PENDING_INVITATION,
  STATUS_UNASSIGNED,
} from "./constant/stellariStudies";
import { selectMainProfileId } from "./reducers/preselezioneStudyReducers";

const StudyManager: React.FC = () => {
  const dispatch = useDispatch();

  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUser.id
  );

  const mainProfileId = useSelector(selectMainProfileId);

  const prevProfilesLength = useRef(-1);

  const accountConfirmedAt = useSelector(
    (state: RootState) => state.user.currentUser.account.accountConfirmedAt
  );

  const profiles = useSelector(
    (state: RootState) => state.user.currentUser.profiles
  );

  const preselezioneStudyStatus = useSelector(
    (state: InfluwebState) => state.preselezioneStudy.status
  );

  const surveyMode = useSelector(
    (state: RootState) => state.app.surveyMode.active
  );

  const studyGroup = useSelector((state: InfluwebState) => state.studyGroup);

  // preselezizone study
  useEffect(() => {
    if (preselezioneStudyStatus === STATUS_UNASSIGNED && currentUserId) {
      dispatch(
        initializePreselezioneStudy({ mainProfileId, accountConfirmedAt })
      );
    }

    if (
      preselezioneStudyStatus === STATUS_PENDING_INVITATION &&
      currentUserId
    ) {
      dispatch(inviteToPreselezioneStudy(mainProfileId));
    }
  }, [
    dispatch,
    preselezioneStudyStatus,
    currentUserId,
    accountConfirmedAt,
    mainProfileId,
  ]);

  useEffect(() => {
    if (
      preselezioneStudyStatus === STATUS_ASSIGNED &&
      !surveyMode &&
      currentUserId
    ) {
      dispatch(checkUserGroup(mainProfileId));
    }
  }, [
    dispatch,
    currentUserId,
    preselezioneStudyStatus,
    surveyMode,
    mainProfileId,
  ]);

  // study group
  useEffect(() => {
    if (
      !studyGroup.group &&
      currentUserId &&
      preselezioneStudyStatus === STATUS_COMPLETED
    ) {
      dispatch(initializeStudyGroup(mainProfileId));
    }

    if (
      studyGroup.group === OPERATORE_GROUP &&
      studyGroup.status === STATUS_PENDING_INVITATION &&
      currentUserId
    ) {
      dispatch(inviteToOperatoreStudy(mainProfileId));
    }
  }, [
    dispatch,
    studyGroup.group,
    studyGroup.status,
    currentUserId,
    preselezioneStudyStatus,
    mainProfileId,
  ]);

  // profile
  useEffect(() => {
    if (
      profiles.length > 1 &&
      profiles.length !== prevProfilesLength.current &&
      studyGroup.group === GENITORE_GROUP &&
      studyGroup.status === STATUS_ASSIGNED
    ) {
      dispatch(inviteProfilesToBambinoStudy(profiles));
    }

    prevProfilesLength.current = profiles.length;
  }, [dispatch, profiles, studyGroup.group, studyGroup.status]);

  return null;
};

export default StudyManager;
