import { StateFromReducersMapObject } from "@reduxjs/toolkit";
import { reducersManager } from "case-web-app-core";
import { preselezioneStudyReducer } from "../reducers/preselezioneStudyReducers";
import { studyGroupReducer } from "../reducers/studyGroupReducers";

const reducersMap = {
  preselezioneStudy: preselezioneStudyReducer,
  studyGroup: studyGroupReducer,
};

export function configureState() {
  reducersManager.add(reducersMap);
}

export type InfluwebState = StateFromReducersMapObject<typeof reducersMap>;
