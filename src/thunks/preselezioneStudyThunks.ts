import { createAsyncThunk } from "@reduxjs/toolkit";
import { coreReduxThunks, studyAPI } from "@influenzanet/case-web-app-core";
import { User } from "@influenzanet/case-web-app-core/build/api/types/user";
import { StudyInfoForUser } from "@influenzanet/case-web-ui/build/types/studyAPI";
import { getMainProfileId } from "../utils/helpers";
import { StudyStatus } from "../reducers/preselezioneStudyReducers";
import {
  PRESELEZIONE_REPORT,
  PRESELEZIONE_STUDY,
  STATUS_ASSIGNED,
  STATUS_COMPLETED,
  STATUS_PENDING_INVITATION,
  STATUS_UNASSIGNED,
} from "../constant/stellariStudies";

export const initializePreselezioneStudy = createAsyncThunk<StudyStatus, User>(
  "preselezioneStudy/initialize",
  async (currentUser: User) => {
    if (!currentUser.id) {
      return STATUS_UNASSIGNED;
    }

    const response = await studyAPI.getStudiesForUserReq();

    const preselezioneStudyInfo: StudyInfoForUser = response.data.studies?.find(
      (study: StudyInfoForUser) => study.key === PRESELEZIONE_STUDY
    );

    if (!preselezioneStudyInfo) {
      return STATUS_PENDING_INVITATION;
    }

    const mainProfileId = getMainProfileId(currentUser);

    if (!mainProfileId) {
      return STATUS_UNASSIGNED;
    }

    let studyStatus: StudyStatus = preselezioneStudyInfo.profileIds.some(
      (profileId) => profileId === mainProfileId
    )
      ? STATUS_ASSIGNED
      : currentUser.account.accountConfirmedAt > 0
      ? STATUS_PENDING_INVITATION
      : STATUS_UNASSIGNED;

    if (studyStatus === STATUS_ASSIGNED) {
      const repResponse = await studyAPI.getReportsForUser(
        [PRESELEZIONE_STUDY],
        [mainProfileId],
        PRESELEZIONE_REPORT
      );

      studyStatus =
        repResponse.data.reports?.length > 0 ? STATUS_COMPLETED : studyStatus;
    }

    return studyStatus;
  }
);

export const inviteToPreselezioneStudy = createAsyncThunk(
  "preselezioneStudy/invite",
  async (currentUser: User, { dispatch }) => {
    const mainProfileId = getMainProfileId(currentUser);
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

export const checkUserGroup = createAsyncThunk<string | undefined, User>(
  "preselezioneStudy/checkUserGroup",
  async (currentUser: User) => {
    const mainProfileId = getMainProfileId(currentUser);
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
  }
);
