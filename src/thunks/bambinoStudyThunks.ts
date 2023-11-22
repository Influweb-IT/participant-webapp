import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@influenzanet/case-web-app-core/build/api/types/user";
import { coreReduxThunks } from "@influenzanet/case-web-app-core";

// TODO completely rewrite this code just for demo purpose

export const inviteProfileToBambinoStudy = createAsyncThunk(
  "bambinoStudy/invited",
  async (currentUser: User, { dispatch }) => {
    if (currentUser.profiles.length === 0) {
      return;
    }

    currentUser.profiles.forEach(async (profile) => {
      if (profile.mainProfile) {
        return;
      }

      await dispatch(
        coreReduxThunks.enterStudyThunk({
          profileId: profile.id,
          studyKey: "stellari_bambino",
        })
      );
    });
  }
);
