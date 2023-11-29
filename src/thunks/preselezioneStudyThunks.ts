import { createAsyncThunk } from "@reduxjs/toolkit";
import { coreReduxThunks, studyAPI } from "@influenzanet/case-web-app-core";
import { StudyInfoForUser } from "@influenzanet/case-web-ui/build/types/studyAPI";
import { StudyStatus } from "../reducers/preselezioneStudyReducers";
import {
  PRESELEZIONE_REPORT,
  PRESELEZIONE_STUDY,
  STATUS_ASSIGNED,
  STATUS_COMPLETED,
  STATUS_PENDING_INVITATION,
  STATUS_UNASSIGNED,
} from "../constant/stellariStudies";
import { EnterStudyPayload } from "@influenzanet/case-web-app-core/build/store/actions/studiesActions";

export const initializePreselezioneStudy = createAsyncThunk<
  StudyStatus,
  { mainProfileId: string | undefined; accountConfirmedAt: number }
>("preselezioneStudy/initialize", async (arg) => {
  const response = await studyAPI.getStudiesForUserReq();

  const preselezioneStudyInfo: StudyInfoForUser = response.data.studies?.find(
    (study: StudyInfoForUser) => study.key === PRESELEZIONE_STUDY
  );

  if (!preselezioneStudyInfo) {
    return STATUS_PENDING_INVITATION;
  }

  if (!arg.mainProfileId) {
    return STATUS_UNASSIGNED;
  }

  let studyStatus: StudyStatus = preselezioneStudyInfo.profileIds.some(
    (profileId) => profileId === arg.mainProfileId
  )
    ? STATUS_ASSIGNED
    : arg.accountConfirmedAt > 0
    ? STATUS_PENDING_INVITATION
    : STATUS_UNASSIGNED;

  if (studyStatus === STATUS_ASSIGNED) {
    const repResponse = await studyAPI.getReportsForUser(
      [PRESELEZIONE_STUDY],
      [arg.mainProfileId],
      PRESELEZIONE_REPORT
    );

    studyStatus =
      repResponse.data.reports?.length > 0 ? STATUS_COMPLETED : studyStatus;
  }

  return studyStatus;
});

export const inviteToPreselezioneStudy = createAsyncThunk(
  "preselezioneStudy/invite",
  async (mainProfileId: string | undefined, { dispatch }) => {
    if (mainProfileId) {
      await dispatch(
        coreReduxThunks.enterStudyThunk({
          profileId: mainProfileId,
          studyKey: PRESELEZIONE_STUDY,
        })
      );
    }
  }
);

export const checkUserGroup = createAsyncThunk<
  string | undefined,
  string | undefined
>("preselezioneStudy/checkUserGroup", async (mainProfileId) => {
  if (!mainProfileId) {
    throw new Error(
      "this is not supposed to be called when the user is not logged in"
    );
  }

  const response = await studyAPI.getReportsForUser(
    [PRESELEZIONE_STUDY],
    [mainProfileId],
    PRESELEZIONE_REPORT
  );

  if (!response.data?.reports) {
    return undefined;
  }
  // TODO improve access safety
  return response.data.reports[0].data[0].value;
});
