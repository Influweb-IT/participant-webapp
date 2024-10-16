import IframeResizer  from "@iframe-resizer/react";

const IFrame = (props: any) => {
  return (
    <IframeResizer
      id="iframe-target"
      license="GPLv3"
      src={props.baseUrl}
      style={{ width: '100%',  height: '100vh' }}
    />
  );
};


export default IFrame;
