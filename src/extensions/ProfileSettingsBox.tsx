import { useDispatch, useSelector } from "react-redux";
import { InfluwebState } from "../utils/ConfigureState";
import { EditBtn } from "@influenzanet/case-web-ui";
import { coreReduxActions } from "@influenzanet/case-web-app-core";

export const ProfileSettingsBox: React.FC = (props) => {
  const studyGroup = useSelector((state: InfluwebState) => state.studyGroup);

  const dispatch = useDispatch();

  if (
    studyGroup.group &&
    studyGroup.group === "genitore" &&
    studyGroup.status === "assigned"
  ) {
    return (
      <>
        <div className="card mb-2">
          <div className="card-header bg-primary text-white">
            Gestione profili alunni
          </div>
          <div className="card-body">
            <p className="card-text">
              Da qui puoi gestire facilmente i profili degli alunni per i quali
              compilerai i questionari. Clicca sul pulsante sotto per iniziare!
            </p>
            <EditBtn
              onClick={() =>
                dispatch(
                  coreReduxActions.dialogActions.openDialogWithoutPayload({
                    type: "manageProfiles",
                  })
                )
              }
            >
              Gestisci profili
            </EditBtn>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div></div>
      </>
    );
  }
};
