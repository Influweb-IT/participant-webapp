import { createAsyncThunk } from "@reduxjs/toolkit";
import { studyAPI } from "case-web-app-core";
import { User } from "case-web-app-core/build/api/types/user";
import { StudyInfoForUser } from "case-web-ui/build/types/studyAPI";
import { getMainProfileId } from "../utils/helpers";

// TODO add action payload typing

// TODO use simplified definition

export const initializePreselezioneStudy = createAsyncThunk(
  "preselezioneStudy/initialize",
  async (currentUser: User, thunkAPI) => {
    try {
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

      return studyInfoForPreselezioneStudy.profileIds.some(
        (profileId) => profileId === mainProfileId
      )
        ? "assigned"
        : currentUser.account.accountConfirmedAt > 0
        ? "pending_invitation"
        : "unassigned";
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const inviteToPreselezioneStudy = createAsyncThunk(
  "preselezioneStudy/invited",
  async (currentUser: User, thunkAPI) => {
    try {
      const mainProfileId = getMainProfileId(currentUser);
      if (mainProfileId) {
        const response = await studyAPI.enterStudyReq(
          "stellari_preselezione",
          mainProfileId
        );
        return response.data;
      }

      throw new Error("main profile not found");
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const checkUserGroup = createAsyncThunk(
  "preselezioneStudy/checkedUserGroup",
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
