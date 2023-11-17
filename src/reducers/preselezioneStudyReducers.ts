import { createReducer } from "@reduxjs/toolkit";
import { coreReduxActions } from "@influenzanet/case-web-app-core";
import {
  checkUserGroup,
  initializePreselezioneStudy,
  inviteToPreselezioneStudy,
} from "../thunks/preselezioneStudyThunks";

export type StudyStatus =
  | "unassigned"
  | "pending_invitation"
  | "assigned"
  | "completed";

export type StudyStatusState = {
  status: StudyStatus;
};

const initialState: StudyStatusState = {
  status: "unassigned",
};

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
        state.status = "pending_invitation";
      }
    );

    builder.addCase(
      inviteToPreselezioneStudy.fulfilled,
      (state = initialState) => {
        state.status = "assigned";
      }
    );

    builder.addCase(inviteToPreselezioneStudy.rejected, (state, action) => {
      state.status = "pending_invitation";

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

      state.status = "completed";
    });

    builder.addDefaultCase((state = initialState) => {
      return state;
    });
  }
);
