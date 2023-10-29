import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "case-web-app-core/build/api/types/user";
import { getMainProfileId } from "../utils/helpers";
import { studyAPI } from "case-web-app-core";
import { StudyInfoForUser } from "case-web-ui/build/types/studyAPI";

// TODO add action payload typing

// TODO add initialization thunk

export const inviteToOperatoreStudy = createAsyncThunk(
  "studyGroup/invitedToOperatoreStudy",
  async (currentUser: User) => {
    const mainProfileId = getMainProfileId(currentUser);
    if (mainProfileId) {
      const response = await studyAPI.enterStudyReq(
        "stellari_operatore",
        mainProfileId
      );
      return response.data;
    }

    throw new Error("main profile not found");
  }
);

export const initializeStudyGroup = createAsyncThunk(
  "studyGroup/inizializedStudyGroup",
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
