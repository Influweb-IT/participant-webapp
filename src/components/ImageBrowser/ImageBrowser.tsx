import React, { useEffect, useRef, useState } from "react";
import { ImageBrowserViewModel } from "./models/ImageBrowserViewModel";
import { ImageBrowserDataReader } from "./services/ImageBrowserDataReader";

import "./ImageBrowser.scss";

import { format as formatDate } from "date-fns";
import { useTranslation } from "react-i18next";

export interface ImageBrowserProps {
  className?: string;
  enableAnimations?: boolean;
  dataReader: ImageBrowserDataReader;
  // TODO the type should be exported from case web app core
  dateLocales: Array<{ code: string; locale: any; format: string }>;
}

const ImageBrowser: React.FC<ImageBrowserProps> = (props) => {
  const [index, setIndex] = useState(0);
  const [images, setImages] = useState(new Array<ImageBrowserViewModel>());

  const { i18n } = useTranslation();

  const selectIndex = function (i: number) {
    // HACK: disable animations by setting prevIndex equal to the future index value
    if (!props.enableAnimations) prevIndex.current = i;

    setIndex(i);
  };

  // can we rewrite these using callback
  const prev = () => {
    const newIndex = Math.max(0, index - 1);
    selectIndex(newIndex);
  };

  const next = () => {
    const newIndex = Math.min(images.length - 1, index + 1);
    selectIndex(newIndex);
  };

  useEffect(() => {
    let isMounted = true;

    // handle loading

    if (index < images.length - 2) return;

    async function retrieveData() {
      const data = await props.dataReader.next(5);

      if (isMounted && data.length > 0) {
        setImages(images.concat(data));
      }
    }

    retrieveData();

    return () => {
      isMounted = false;
    };
  }, [props.dataReader, index, images]);

  const prevIndex = useRef(0);
  const animationRequestId = useRef(0);

  const transitionDivRef = useRef<HTMLDivElement>(null);

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
    if (!transitionDivRef.current) return;

    // NOTE: default is no transition
    let transitionClass = "transition-none";

    // NOTE: compute the direction of the transition
    if (prevIndex.current > index) {
      transitionClass = "transition-right";
    } else if (prevIndex.current < index) {
      transitionClass = "transition-left";
    }

    prevIndex.current = index;

    transitionDivRef.current!.className = "";

    // NOTE: cancel the previous request to avoid concurrency
    if (animationRequestId.current > 0) {
      cancelAnimationFrame(animationRequestId.current);
    }

    // NOTE: this resets the CSS animation, see:
    // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Tips#run_an_animation_again
    animationRequestId.current = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        transitionDivRef.current!.classList.add(transitionClass);
        animationRequestId.current = 0;
        return true;
      });
      return true;
    });
  }, [index]);

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
      {images.length === 0 ? (
        <h5>No reports</h5>
      ) : (
        <>
          <h5 className="fw-bold">
            {formatDate(new Date(images[index].date * 1000), "Pp", {
              locale: props.dateLocales?.find((dl) => dl.code === i18n.language)?.locale,
            })}
          </h5>
          {/* NOTE: the class name below forces a DOM update whenever the index
           * or the reports length changes, this is required to enforce the
           * clearing of the animation class and stop the images from flickering
           * when resetting the CSS animation */}
          <div ref={transitionDivRef} id="transition-div" className={`index-${index} n-reports-${images.length}`}>
            <div className="d-flex align-items-center">
              <div id="left_arrow" className="d-sm-none">
                <i className="bi-arrow-left-circle" style={{ fontSize: "300%" }}></i>
              </div>
              <div className="feedback-slot d-flex align-items-center justify-content-center position-relative">
                <div className="feedback-slot-small position-relative">
                  {prevIndex.current > 0 && (
                    /* eslint-disable-next-line */
                    <img src={images[prevIndex.current - 1]!.imageUrl} className="img-thumbnail" id="prev-week"></img>
                  )}
                  {prevIndex.current > 1 && (
                    /* eslint-disable-next-line */
                    <img
                      src={images[prevIndex.current - 2]!.imageUrl}
                      className="img-thumbnail"
                      id="new-prev-week"
                    ></img>
                  )}
                  {index > 0 && <div className="click-layer" onClick={prev} />}
                </div>
              </div>
              <div className="feedback-slot">
                <div className="position-relative">
                  {/* eslint-disable-next-line */}
                  <img src={images[prevIndex.current]!.imageUrl} className="img-thumbnail" id="current-week"></img>
                  <div className="click-layer"></div>
                </div>
              </div>
              <div className=" feedback-slot d-flex align-items-center justify-content-center position-relative">
                <div className="feedback-slot-small position-relative">
                  {images.length - prevIndex.current > 1 && (
                    /* eslint-disable-next-line */
                    <img src={images[prevIndex.current + 1]!.imageUrl} className="img-thumbnail" id="next-week"></img>
                  )}
                  {images.length - prevIndex.current > 2 && (
                    /* eslint-disable-next-line */
                    <img
                      src={images[prevIndex.current + 2]!.imageUrl}
                      className="img-thumbnail"
                      id="new-next-week"
                    ></img>
                  )}
                  {images.length - index > 1 && <div className="click-layer" onClick={next}></div>}
                </div>
              </div>
              <div id="right_arrow" className="d-sm-none">
                <i className="bi-arrow-right-circle" style={{ fontSize: "300%" }}></i>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

ImageBrowser.defaultProps = {
  className: "col-lg-8 text-white bg-primary",
  enableAnimations: true,
};

export default ImageBrowser;
