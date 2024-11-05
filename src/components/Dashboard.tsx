import IframeResizer  from "@iframe-resizer/react";
import { useTranslation } from "react-i18next";

const Dashboard = (props: any) => {

  const { i18n } = useTranslation();
  const url = `${props.baseUrl}/${i18n.language}`

  return (
    <IframeResizer
      id="iframe-target"
      license="GPLv3"
      src={url}
      style={{ width: '100%',  height: '100vh' }}
    />
  );
};


export default Dashboard;
