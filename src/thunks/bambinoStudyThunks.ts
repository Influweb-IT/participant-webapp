import { createAsyncThunk } from "@reduxjs/toolkit";
import { studyAPI } from "case-web-app-core";
import { User } from "case-web-app-core/build/api/types/user";

// TODO completely rewrite this code just for demo purpose

export const inviteProfileToBambinoStudy = createAsyncThunk(
  "bambinoStudy/invited",
  async (currentUser: User) => {
    if (currentUser.profiles.length === 0) {
      return;
    }

    currentUser.profiles.forEach(async (profile) => {
      if (profile.mainProfile) {
        return;
      }

      const response = await studyAPI.enterStudyReq(
        "stellari_bambino",
        profile.id
      );
    });
  }
);
