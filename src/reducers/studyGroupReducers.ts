import { createReducer } from "@reduxjs/toolkit";
import { checkUserGroup } from "../thunks/preselezioneStudyThunks";
import { inviteToOperatoreStudy } from "../thunks/studyGroupThunks";
import { coreReduxActions } from "case-web-app-core";

export type StudyGroup = {
  group: "operatore" | "genitore" | undefined;
  status: "unassigned" | "pending_invitation" | "assigned";
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

    state.group = action.payload;
    state.status =
      action.payload === "operatore" ? "pending_invitation" : "assigned";
  });

  builder.addCase(inviteToOperatoreStudy.fulfilled, (state, action) => {
    state.status = "assigned";
  });

  builder.addCase(coreReduxActions.userActions.reset, (state, action) => {
    state = initialState;
  });

  builder.addDefaultCase((state = initialState) => {
    return state;
  });
});
