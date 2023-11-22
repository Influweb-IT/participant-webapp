import { createReducer } from "@reduxjs/toolkit";
import { checkUserGroup } from "../thunks/preselezioneStudyThunks";
import {
  initializeStudyGroup,
  inviteToOperatoreStudy,
} from "../thunks/studyGroupThunks";
import { coreReduxActions } from "@influenzanet/case-web-app-core";
import {
  GENITORE_GROUP,
  OPERATORE_GROUP,
  STATUS_ASSIGNED,
  STATUS_PENDING_INVITATION,
  STATUS_UNASSIGNED,
} from "../constant/stellariStudies";

type StudyGroupStatus =
  | typeof STATUS_UNASSIGNED
  | typeof STATUS_PENDING_INVITATION
  | typeof STATUS_ASSIGNED;

type Group = typeof OPERATORE_GROUP | typeof GENITORE_GROUP | undefined;

export type StudyGroup = {
  group: Group;
  status: StudyGroupStatus;
};

const initialState: StudyGroup = {
  group: undefined,
  status: STATUS_UNASSIGNED,
};

export const studyGroupReducer = createReducer(initialState, (builder) => {
  builder.addCase(checkUserGroup.fulfilled, (state, action) => {
    if (!action.payload) {
      return;
    }

    state.group = action.payload as Group;
    state.status =
      action.payload === OPERATORE_GROUP
        ? STATUS_PENDING_INVITATION
        : STATUS_ASSIGNED;
  });

  builder.addCase(initializeStudyGroup.fulfilled, (state, action) => {
    state.group = action.payload.group as Group;
    state.status = action.payload.status;
  });

  builder.addCase(inviteToOperatoreStudy.fulfilled, (state) => {
    state.status = STATUS_ASSIGNED;
  });

  builder.addCase(coreReduxActions.userActions.reset, (state, action) => {
    state.group = initialState.group;
    state.status = initialState.status;
  });

  builder.addDefaultCase((state = initialState) => {
    return state;
  });
});
