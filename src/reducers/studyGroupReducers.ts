import { createReducer } from "@reduxjs/toolkit";
import { checkUserGroup } from "../thunks/preselezioneStudyThunks";
import {
  initializeStudyGroup,
  inviteToOperatoreStudy,
} from "../thunks/studyGroupThunks";
import { coreReduxActions } from "@influenzanet/case-web-app-core";

type StudyGroupStatus = "unassigned" | "pending_invitation" | "assigned";

export type StudyGroup = {
  group: "operatore" | "genitore" | undefined;
  status: StudyGroupStatus;
};

const initialState: StudyGroup = {
  group: undefined,
  status: "unassigned",
};

export const studyGroupReducer = createReducer(initialState, (builder) => {
  builder.addCase(checkUserGroup.fulfilled, (state, action) => {
    if (!action.payload) {
      return;
    }

    state.group = action.payload as "operatore" | "genitore" | undefined;
    state.status =
      action.payload === "operatore" ? "pending_invitation" : "assigned";
  });

  builder.addCase(initializeStudyGroup.fulfilled, (state, action) => {
    state.group = action.payload.group as "operatore" | "genitore" | undefined;
    state.status = action.payload.status;
  });

  builder.addCase(inviteToOperatoreStudy.fulfilled, (state) => {
    state.status = "assigned";
  });

  builder.addCase(coreReduxActions.userActions.reset, (state, action) => {
    state.group = initialState.group;
    state.status = initialState.status;
  });

  builder.addDefaultCase((state = initialState) => {
    return state;
  });
});
