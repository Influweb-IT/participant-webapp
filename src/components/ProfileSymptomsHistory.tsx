import React, { useEffect, useRef, useState } from "react";
import { studyAPI } from "case-web-app-core";

import "./ProfileSymptomsHistory.scss";

/* test code begin */
import mockReports from './mockReports.json';
/* test code end */

interface ProfileSymptomsHistoryProps {
  studyId: string;
  profileId: string;
  className?: string;
  enableAnimations?: boolean;
}

type ReportRequestParameters = Parameters<typeof studyAPI.getReportsForUser>;

const ProfileSymptomsHistory: React.FC<ProfileSymptomsHistoryProps> = (props) => {

  const [ reports, setReports ] = useState<any>([]); // add type

  const [ index, setIndex ] = useState(0);

  const prevIndex = useRef(0);
  const animationRequestId = useRef(0);

  const transitionDivRef = useRef<HTMLDivElement>(null);

  /* test code begin */
  const testNewReports = () => {

    console.log("reports:", reports);
    console.log("adding more reports in 10s...");

    setTimeout(() => {
      const start = reports.length % mockReports.length;
      const end = start + Math.max(reports.length % 2, 1);

      const _reports = [
        ...reports,
        ...mockReports.slice(start, end)
      ];

      setReports(_reports);
    }
      , 10000);
  }

  useEffect(() => {
    testNewReports();
  }, [ reports ]);
  /* test code end */


  const selectIndex = function(i: number, animate?: boolean) {

    // HACK: disable animations by setting prevIndex equal to the future index value
    if(!props.enableAnimations) prevIndex.current = i;

    setIndex(i);
  }

  const prev = function() {

    selectIndex(index - 1, true);

    return true;
  };

  const next = function() {

    selectIndex(index + 1, true);

    return true;
  };

  useEffect(() => {
    const getSymptoms = async (startingDate: number | undefined = undefined) => {
      const requestParameters: ReportRequestParameters = [
        [ props.studyId ],
        [ props.profileId ],
        "symptomsFeedback", // read from shared model
        undefined,
        startingDate,
        undefined,
        5,
      ];

      try {
        const response = await studyAPI.getReportsForUser(...requestParameters);

        console.log(response);
      } catch {
        /* empty */
      } finally {
        /* empty */
      }
    };

    getSymptoms();
  }, [ props.studyId, props.profileId ]);

  /* NOTE: this useEffect handles the CSS animation between two adjacent states
   * whenever the index changes.
   *
   * This runs each time the component is rendered by React an the index
   * changes. When entering this effect, the transition div won't have a
   * transition class.
   *
   * The appropriate transition class is added directly to the DOM by this
   * effect and the animation is reset.
   *
   * At the next render, React won't be aware of the added class and will fail
   * to remove it from the DOM, a crucial step we need in order to have all the
   * images in the right place before restarting the animation, avoiding
   * flickering
   *
   * As a workaround, we introduced a dependency on the index value inside the
   * transition div className attribute so that the transition class will be
   * cleared from the DOM at each render. */
  useEffect(() => {

    if(!transitionDivRef.current) return;

    // NOTE: default is no transition
    let transitionCalss = 'transition-none';

    // NOTE: compute the direction of the transition
    if(prevIndex.current > index) {
      transitionCalss = "transition-right";
    } else if(prevIndex.current < index) {
      transitionCalss = "transition-left";
    }

    prevIndex.current = index;

    transitionDivRef.current!.className = "";

    // NOTE: cancel the previous request to avoid concurrency
    if(animationRequestId.current > 0) {
      cancelAnimationFrame(animationRequestId.current);
    }

    // NOTE: this resets the CSS animation, see:
    // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Tips#run_an_animation_again
    animationRequestId.current = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        transitionDivRef.current!.classList.add(transitionCalss);
        animationRequestId.current = 0;
        return true;
      });
      return true;
    });

  }, [ index ])

  /* NOTE: the placement of the images inside the component reflects the
   * configuration associated to the previous value of the index variable.
   *
   * If the previous index value is different from the current one, the right
   * animation will be triggered by the associated useEffect(), transitioning
   * the images into a configuration reflecting the current index value.
   *
   * If the previous index value equals the current one, a render of the
   * component will place the images in a configuration reflecting the current
   * index value and clear the animation class. As a result, the on-screen
   * placement of the images will be unchanged. */
  return (
    <div className={`symptoms-history ${props.className} d-flex flex-column flex-grow-1 align-items-center p-2 `}>
      {(reports.length === 0) ? <h5>No reports</h5> :
        <>
          <h5 className="fw-bold">{reports[ index ].date}</h5>
          {/* NOTE: the class name below forces a DOM update whenever the index
           * or the reports length changes, this is required to enforce the
           * clearing of the animation class and stop the images from flickering
           * when resetting the CSS animation */}
          <div ref={transitionDivRef} id="transition-div" className={`index-${index} n-reports-${reports.length}`}>
            <div className="d-flex align-items-center">
              <div id="left_arrow" className="d-sm-none">
                <i className="bi-arrow-left-circle" style={{ fontSize: "300%" }}></i>
              </div>
              <div className="feedback-slot d-flex align-items-center justify-content-center position-relative">
                <div className="feedback-slot-small position-relative">
                  {prevIndex.current > 0 &&
                    /* eslint-disable-next-line */
                    <img src={reports[ prevIndex.current - 1 ]!.img}
                      className="img-thumbnail" id="prev-week">
                    </img>
                  }
                  {prevIndex.current > 1 &&
                    /* eslint-disable-next-line */
                    <img
                      src={reports[ prevIndex.current - 2 ]!.img}
                      className="img-thumbnail"
                      id="new-prev-week">
                    </img>
                  }
                  {index > 0 &&
                    <div className="click-layer" onClick={prev} />
                  }
                </div>
              </div>
              <div className="feedback-slot">
                <div className="position-relative">
                  {/* eslint-disable-next-line */}
                  <img src={reports[ prevIndex.current ]!.img}
                    className="img-thumbnail" id="current-week">
                  </img>
                  <div className="click-layer"></div>
                </div>
              </div>
              <div className=" feedback-slot d-flex align-items-center justify-content-center position-relative">
                <div className="feedback-slot-small position-relative">
                  {(reports.length - prevIndex.current) > 1 &&
                    /* eslint-disable-next-line */
                    <img src={reports[ prevIndex.current + 1 ]!.img}
                      className="img-thumbnail" id="next-week"></img>
                  }
                  {(reports.length - prevIndex.current) > 2 &&
                    /* eslint-disable-next-line */
                    <img src={reports[ prevIndex.current + 2 ]!.img}
                      className="img-thumbnail" id="new-next-week"></img>
                  }
                  {(reports.length - index) > 1 &&
                    <div className="click-layer" onClick={next}></div>
                  }
                </div>
              </div>
              <div id="right_arrow" className="d-sm-none">
                <i className="bi-arrow-right-circle" style={{ fontSize: "300%" }}></i>
              </div>
            </div>
          </div >
        </>}
    </div >
  );
};

ProfileSymptomsHistory.defaultProps = {
  className: "col-lg-8 text-white bg-primary",
  enableAnimations: true
}

export default ProfileSymptomsHistory;