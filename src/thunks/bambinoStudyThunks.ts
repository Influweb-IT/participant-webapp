import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@influenzanet/case-web-app-core/build/api/types/user";
import { coreReduxThunks } from "@influenzanet/case-web-app-core";
import { BAMBINO_STUDY } from "../constant/stellariStudies";

/**
 *
 * we invite all profiles that are not in the study
 * sort of a poor man retry logic
 */
export const inviteProfilesToBambinoStudy = createAsyncThunk(
  "bambinoStudy/invite",
  async (currentUser: User, { dispatch }) => {
    if (currentUser.profiles.length === 0) {
      return;
    }

    currentUser.profiles.forEach(async (profile) => {
      if (
        profile.mainProfile ||
        (profile.studies && profile.studies.includes(BAMBINO_STUDY))
      ) {
        return;
      }

      await dispatch(
        coreReduxThunks.enterStudyThunk({
          profileId: profile.id,
          studyKey: BAMBINO_STUDY,
        })
      );
    });
  }
);
