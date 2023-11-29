import { createReducer, createSelector } from "@reduxjs/toolkit";
import { coreReduxActions } from "@influenzanet/case-web-app-core";
import {
  checkUserGroup,
  initializePreselezioneStudy,
  inviteToPreselezioneStudy,
} from "../thunks/preselezioneStudyThunks";
import {
  STATUS_ASSIGNED,
  STATUS_COMPLETED,
  STATUS_PENDING_INVITATION,
  STATUS_UNASSIGNED,
} from "../constant/stellariStudies";
import { RootState } from "@influenzanet/case-web-app-core/build/store/rootReducer";

export type StudyStatus =
  | typeof STATUS_UNASSIGNED
  | typeof STATUS_PENDING_INVITATION
  | typeof STATUS_ASSIGNED
  | typeof STATUS_COMPLETED;

export type StudyStatusState = {
  status: StudyStatus;
};

const initialState: StudyStatusState = {
  status: STATUS_UNASSIGNED,
};

export const selectMainProfileId = createSelector(
  [(state: RootState) => state.user.currentUser.profiles],
  (profilesState) => {
    const mainProfile = profilesState.find(
      (profile) => profile.mainProfile === true
    );

    return mainProfile ? mainProfile.id : undefined;
  }
);

export const preselezioneStudyReducer = createReducer(
  initialState,
  (builder) => {
    builder.addCase(
      initializePreselezioneStudy.fulfilled,
      (state = initialState, action) => {
        state.status = action.payload;
      }
    );

    builder.addCase(
      initializePreselezioneStudy.rejected,
      (state = initialState, action) => {
        // here we should probably show a dialog asking the user to refresh
        // but we don't have such things
        console.log(action.payload);
      }
    );

    builder.addCase(
      coreReduxActions.signupActions.contactVerified,
      (state = initialState) => {
        state.status = STATUS_PENDING_INVITATION;
      }
    );

    builder.addCase(
      inviteToPreselezioneStudy.fulfilled,
      (state = initialState) => {
        state.status = STATUS_ASSIGNED;
      }
    );

    builder.addCase(inviteToPreselezioneStudy.rejected, (state, action) => {
      state.status = STATUS_PENDING_INVITATION;

      // same as above
      console.log(action.payload);
    });

    builder.addCase(coreReduxActions.userActions.reset, (state, action) => {
      state.status = initialState.status;
    });

    builder.addCase(checkUserGroup.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }

      state.status = STATUS_COMPLETED;
    });

    builder.addDefaultCase((state = initialState) => {
      return state;
    });
  }
);
