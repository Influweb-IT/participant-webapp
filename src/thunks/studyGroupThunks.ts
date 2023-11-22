import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@influenzanet/case-web-app-core/build/api/types/user";
import { getMainProfileId } from "../utils/helpers";
import { coreReduxThunks, studyAPI } from "@influenzanet/case-web-app-core";
import { StudyInfoForUser } from "@influenzanet/case-web-ui/build/types/studyAPI";
import { StudyGroup } from "../reducers/studyGroupReducers";
import {
  OPERATORE_GROUP,
  OPERATORE_STUDY,
  PRESELEZIONE_REPORT,
  PRESELEZIONE_STUDY,
  STATUS_ASSIGNED,
  STATUS_PENDING_INVITATION,
  STATUS_UNASSIGNED,
} from "../constant/stellariStudies";

export const inviteToOperatoreStudy = createAsyncThunk(
  "studyGroup/inviteToOperatoreStudy",
  async (currentUser: User, { dispatch }) => {
    const mainProfileId = getMainProfileId(currentUser);
    if (mainProfileId) {
      await dispatch(
        coreReduxThunks.enterStudyThunk({
          profileId: mainProfileId,
          studyKey: OPERATORE_STUDY,
        })
      );
    }
  }
);

export const initializeStudyGroup = createAsyncThunk<StudyGroup, User>(
  "studyGroup/inizializeStudyGroup",
  async (currentUser: User) => {
    if (!currentUser.id) {
      return { group: undefined, status: STATUS_UNASSIGNED };
    }

    const response = await studyAPI.getStudiesForUserReq();
    const studyInfoForOperatoreStudy = response.data.studies?.find(
      (study: StudyInfoForUser) => study.key === OPERATORE_STUDY
    );

    const mainProfileId = getMainProfileId(currentUser);

    if (!mainProfileId) {
      return { group: undefined, status: STATUS_UNASSIGNED };
    }

    if (!studyInfoForOperatoreStudy) {
      const repResponse = await studyAPI.getReportsForUser(
        [PRESELEZIONE_STUDY],
        [mainProfileId],
        PRESELEZIONE_REPORT
      );

      if (!repResponse.data.reports) {
        return { group: undefined, status: STATUS_UNASSIGNED };
      }

      const group = repResponse.data.reports[0].data[0].value;
      const status =
        group === OPERATORE_GROUP ? STATUS_PENDING_INVITATION : STATUS_ASSIGNED;

      return { group, status };
    } else {
      return { group: OPERATORE_GROUP, status: STATUS_ASSIGNED };
    }
  }
);
