import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@influenzanet/case-web-app-core/build/api/types/user";
import { getMainProfileId } from "../utils/helpers";
import { coreReduxThunks, studyAPI } from "@influenzanet/case-web-app-core";
import { StudyInfoForUser } from "@influenzanet/case-web-ui/build/types/studyAPI";
import { StudyGroup } from "../reducers/studyGroupReducers";

export const inviteToOperatoreStudy = createAsyncThunk(
  "studyGroup/inviteToOperatoreStudy",
  async (currentUser: User, { dispatch }) => {
    const mainProfileId = getMainProfileId(currentUser);
    if (mainProfileId) {
      await dispatch(
        coreReduxThunks.enterStudy({
          profileId: mainProfileId,
          studyKey: "stellari_operatore",
        })
      );
    }
  }
);

export const initializeStudyGroup = createAsyncThunk<StudyGroup, User>(
  "studyGroup/inizializeStudyGroup",
  async (currentUser: User) => {
    if (!currentUser.id) {
      return { group: undefined, status: "unassigned" };
    }

    const response = await studyAPI.getStudiesForUserReq();
    const studyInfoForOperatoreStudy = response.data.studies?.find(
      (study: StudyInfoForUser) => study.key === "stellari_operatore"
    );

    const mainProfileId = getMainProfileId(currentUser);

    if (!mainProfileId) {
      return { group: undefined, status: "unassigned" };
    }

    if (!studyInfoForOperatoreStudy) {
      const repResponse = await studyAPI.getReportsForUser(
        ["stellari_preselezione"],
        [mainProfileId],
        "preselezione"
      );

      if (!repResponse.data.reports) {
        return { group: undefined, status: "unassigned" };
      }

      const group = repResponse.data.reports[0].data[0].value;
      const status = group === "operatore" ? "pending_invitation" : "assigned";

      return { group, status };
    } else {
      return { group: "operatore", status: "assigned" };
    }
  }
);
