import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "case-web-app-core/build/api/types/user";
import { getMainProfileId } from "../utils/helpers";
import { studyAPI } from "case-web-app-core";

// TODO add action payload typing

// TODO add initialization thunk

export const inviteToOperatoreStudy = createAsyncThunk(
  "studyGroup/invitedToOperatoreStudy",
  async (currentUser: User) => {
    const mainProfileId = getMainProfileId(currentUser);
    if (mainProfileId) {
      const response = await studyAPI.enterStudyReq(
        "stellari_operatore",
        mainProfileId
      );
      return response.data;
    }

    throw new Error("main profile not found");
  }
);
