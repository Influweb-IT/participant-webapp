import { createAsyncThunk } from "@reduxjs/toolkit";
import { coreReduxThunks, studyAPI } from "@influenzanet/case-web-app-core";
import { User } from "@influenzanet/case-web-app-core/build/api/types/user";
import { StudyInfoForUser } from "@influenzanet/case-web-ui/build/types/studyAPI";
import { getMainProfileId } from "../utils/helpers";
import { StudyStatus } from "../reducers/preselezioneStudyReducers";

// TODO add action payload typing

// TODO use simplified definition

// TODO clean logic

export const initializePreselezioneStudy = createAsyncThunk<StudyStatus, User>(
  "preselezioneStudy/initialize",
  async (currentUser: User) => {
    if (!currentUser.id) {
      return "unassigned";
    }

    const response = await studyAPI.getStudiesForUserReq();

    const studyInfoForPreselezioneStudy: StudyInfoForUser =
      response.data.studies?.find(
        (study: StudyInfoForUser) => study.key === "stellari_preselezione"
      );

    if (!studyInfoForPreselezioneStudy) {
      return "pending_invitation";
    }

    const mainProfileId = getMainProfileId(currentUser);

    if (!mainProfileId) {
      return "unassigned";
    }

    let studyStatus: StudyStatus =
      studyInfoForPreselezioneStudy.profileIds.some(
        (profileId) => profileId === mainProfileId
      )
        ? "assigned"
        : currentUser.account.accountConfirmedAt > 0
        ? "pending_invitation"
        : "unassigned";

    if (studyStatus === "assigned") {
      const repResponse = await studyAPI.getReportsForUser(
        ["stellari_preselezione"],
        [mainProfileId],
        "preselezione"
      );

      studyStatus =
        repResponse.data.reports?.length > 0 ? "completed" : studyStatus;
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
        coreReduxThunks.enterStudy({
          profileId: mainProfileId,
          studyKey: "stellari_preselezione",
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
      ["stellari_preselezione"],
      [mainProfileId],
      "preselezione"
    );

    if (!response.data?.reports) {
      return undefined;
    }
    // TODO improve access safety
    return response.data.reports[0].data[0].value;
  }
);
