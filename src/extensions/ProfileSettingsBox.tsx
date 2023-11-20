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
              Per visualizzare il questionario basale per il bambino/a, è
              necessario creare un profilo attraverso "Gestisci profili",
              cliccare su "Nuovo profilo per il bambino/a" a quel punto è
              possibile creare uno o più profili per i bambini inserendo il loro
              nome e cliccando sul tasto "Crea un profilo per il bambino/a"
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
