import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
import axios from "axios";
import "./components/layout/layout.css";
import Canvas from "./containers/Canvas";
import Annotation from "./Annotation";
import DocAnnotation from "./components/annotation/DocAnnotation";
import Cropper from "./components/crop/Cropper";
import MagnifierComp from "./components/magnifier/Magnifier";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";


// import { weekdays, organisations, location, weapons } from "./utils/constant";

import DocumentComp from "./components/DocumentComp/DocumentComp";

const port = 5555;
const Layout = () => {
  const navigate = useNavigate();
  const state = useLocation();
  const BASE_URL = "http://127.0.0.1:5000";
  let urlPath = window.location.pathname.split("/");
  const homepath = `/${urlPath[1]}/${urlPath[2]}`;
  const annotType = urlPath[2];
  const { TypeOfBoundingBox, numberOfBoundingBox, image } = state.state.info;
  const type = TypeOfBoundingBox;
  const [bbCount, setBbCount] = useState(numberOfBoundingBox);
  const [imgAnnotCount, setImgAnnotCount] = useState(image);
  const canvasRef = useRef(null);
  const [rangSetting, setRangSetting] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [scale, setScale] = useState(1);
  const defaultScale = 1.0;
  const [annotationSec, setAnnotationSec] = useState(false);
  const [docAnnotationSec, setDocAnnotationSec] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [annotation, setAnnotation] = useState({});
  const [annotData, setAnnotData] = useState([]);
  const [polyAnnotData, setPolyAnnotData] = useState([]);
  const location = useLocation();
  const currentURL = location.pathname;
  const [upImg, setUpImg] = useState();
  const [posTags, setPosTags] = useState();
  const annotationStackRef = useRef([]);
  const annotWrapper = {
    position: "absolute",
    top: "0px",
    left: "0px",
    right: "0px",
    bottom: "0px",
    zIndex: 1,
    transform: `scale(${annotType == "doc" ? 1 : scale})`,
  };
  const handleReload = () => {
    window.location.reload();
  };
  const [polygonSec, setPolygonSec] = useState(false);
  const [magnifierSec, setMagnifierSec] = useState(false);
  const [docMagnifierSec, setDocMagnifierSec] = useState(false);
  const [isPolygon, setIsPolygone] = useState(false);
  const [cropSec, setCropSec] = useState(false);
  const [detectorSec, setDetectorSec] = useState(false);
  const [loadindDetect, setLoadingDetect] = useState(false);
  const initUrl =
    "https://thumbs.dreamstime.com/b/athlete-running-man-male-runner-san-francisco-listening-to-music-smartphone-sporty-fit-young-jogging-45059586.jpg";
  const [url, setUrl] = useState(initUrl);
  const [ind, setInd] = useState(0);
  const [images, setImages] = useState([]);
  const [isAnnotationCopy, setIsAnnotationCopy] = useState(false);
  const defaultImageSet = {
    original: "",
    thumbnail: "",
  };

  // const [image, setImage] = useState()
  // const images = [
  //   {
  //     original:'https://thumbs.dreamstime.com/b/athlete-running-man-male-runner-san-francisco-listening-to-music-smartphone-sporty-fit-young-jogging-45059586.jpg',
  //     thumbnail: "https://picsum.photos/id/1019/250/150/",
  //   },
  //   {
  //     original:'https://thumbs.dreamstime.com/b/sports-fitness-fit-person-running-shore-workout-lesson-sports-fitness-fit-person-running-shore-workout-jogging-theme-148652065.jpg',
  //     thumbnail: "https://picsum.photos/id/1015/250/150/",
  //   },
  //   {
  //     original: "https://images.seattletimes.com/wp-content/uploads/2022/09/09092022_2-traffic-fatalities_131910.jpg?d=780x520",
  //     thumbnail: "https://picsum.photos/seed/picsum/250/150/",
  //   },
  // ];
  const posDescriptions = {
    CC: "Coordinating conjunction",
    CD: "Cardinal number",
    DT: "Determiner",
    IN: "Preposition or subordinating conjunction",
    JJ: "Adjective",
    NN: "Noun, singular or mass",
    RB: "Adverb",
    VB: "Verb, base form",
    Na: "other",
  };







  const customStyles = `
    .date-button {
      padding: 2px 4px -3px;
      font-size: 9px;
      margin-left: 3px; 
      font-weight:bold;
      margin-right: 3px;
      }
  `;
  







  const getImageFun = (value) => {
    const payload = { id: value };
    fetch(BASE_URL + "/getImg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((output) => {
        if (output.url) {
          setUrl(output.url);
        } else {
          const rgbArray = output.imgrbg;

          const buffer = new Uint8Array(rgbArray).buffer;

          const blob = new Blob([buffer], { type: "image/png" });

          const reader = new FileReader();
          reader.onloadend = () => {
            setUrl(reader.result);
            setLoadingDetect(false);
          };
          reader.readAsDataURL(blob);
        }
      })
      .catch((e) => console.log("error", e));
  };
  const Detector = (apiType) => {
    const payload = { id: images[ind]._id, apiType };
    fetch(BASE_URL + "/imgDetect", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((output) => {
        if (output.imgrbg) {
          const rgbArray = output.imgrbg;

          const buffer = new Uint8Array(rgbArray).buffer;

          const blob = new Blob([buffer], { type: "image/png" });

          const reader = new FileReader();
          reader.onloadend = () => {
            setUrl(reader.result);
            setLoadingDetect(false);
          };
          reader.readAsDataURL(blob);
        }
      });
  };

  const fetchCoordinate = () => {
    const payload = { id: images[ind]?._id };
    fetch(BASE_URL + "/getCoordinate", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((output) => {
        console.log("AnnotCodres", output);
        if (output) setBbCount(output.coordinates.length);
      })
      .catch((err) => console.log("error", err));
  };
  // useEffect(() => {
  //   if (images)
  //     fetchCoordinate()
  // }, [ind])

  // useEffect(() => {
  //   fetch(BASE_URL + '/allData')
  //     .then(res => res.json())
  //     .then(output => {
  //       setImages(output.data);
  //       getImageFun(1)
  //     })
  // }, [])

  const controller = {
    top: "45%",
    position: "absolute",
    zIndex: "100",
    fontSize: "36px",
    cursor: "pointer",
    color: "white",
  };
  const indicatorWrapper = {
    fontSize: "22px",
    color: "white",
    top: "10px",
    right: "20px",
    zIndex: "100",
    textShadow: "2px 2px 2px black",
    position: "absolute",
    backgroundColor: "gray",
    padding: "3px 10px",
  };

  const onChangeType = (arg) => {
    if (arg === "rect") {
        setAnnotationSec(true);
        setDocAnnotationSec(true);
        setDocMagnifierSec(false);
        setIsAnnotationCopy(false);
        setPolygonSec(false);
        setMagnifierSec(false);
        setRangSetting(0);
    } else if (arg === "polygon") {
      if (polygonSec) setPolygonSec(!polygonSec);
      else {
        setPolygonSec(true);
        setAnnotationSec(false);
        setIsAnnotationCopy(false);
        setCropSec(false);
        setMagnifierSec(false);
        setRangSetting(0);
      }
    } else if (arg === "detector") {
      setDetectorSec(true);
      setPolygonSec(false);
      setAnnotationSec(false);
      setIsAnnotationCopy(false);
      setDocAnnotationSec(false);
      setCropSec(false);
      setMagnifierSec(false);
      setRangSetting(0);
    } else if (arg === "annotation_copy") {
      setIsAnnotationCopy(true);
      setAnnotationSec(true);
      setDocAnnotationSec(false);
      setPolygonSec(false);
      setMagnifierSec(false);
      setRangSetting(0);
    } else if (arg === "crop") {
      if (cropSec) {
        setCropSec(!cropSec);
        setAnnotationSec(false);
        setDocAnnotationSec(false);
      } else {
        setCropSec(true);
        setAnnotationSec(false);
        setDocAnnotationSec(false);
        setIsAnnotationCopy(false);
        setPolygonSec(false);
        setMagnifierSec(false);
        setRangSetting(0);
      }
    } else if (arg === "brightness") {
      if (rangSetting === 0) {
        setRangSetting(1);
        setDocMagnifierSec(false);
      }
      else setRangSetting(0);
    } else if (arg === "magnifier") {
      if (annotType === "doc") {
        setDocMagnifierSec(true);
      }
      if (magnifierSec) setMagnifierSec(!magnifierSec);
      else {
        setMagnifierSec(true);
        setAnnotationSec(false);
        setDocAnnotationSec(false);
        setIsAnnotationCopy(false);
        setPolygonSec(false);
        setCropSec(false);
        setRangSetting(0);
      }
    } else if (arg === "close_all") {
      setMagnifierSec(false);
      setDocMagnifierSec(false);
      setCropSec(false);
      setAnnotationSec(false);
      setDocAnnotationSec(false);
      setDetectorSec(false);
      setIsAnnotationCopy(false);
      setPolygonSec(false);
      setBrightness(100);
      setRangSetting(0);
      setScale(1);
    }
  };

  const zoomIn = () => {
    setDocMagnifierSec(false);
    setScale((prevScale) => prevScale + 0.1);
  };

  const zoomOut = () => {
    setDocMagnifierSec(false);
    const newScale = scale - 0.1;

    if (newScale <= defaultScale) {
      setScale(defaultScale);
    } else {
      setScale(newScale);
    }
  };

  const onChange = (annotation) => {
    setAnnotation(annotation);
  };

  const onSubmit = (annotation) => {
    const { geometry, data } = annotation;
    setAnnotations(
      annotations.concat({
        geometry,
        data: {
          ...data,
          id: Math.random(),
        },
      })
    );
    annotationStackRef.current = []; // Clear the redo stack when new annotation is added
  };

  const goTo = (arg) => {
    if (arg === "home") navigate(homepath);
  };

  const handleUndo = () => {
    // Access the undo function through the ref
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

  const handleRedo = () => {
    // Access the undo function through the ref
    if (canvasRef.current) {
      canvasRef.current.redo();
    }
  };

  const handleBrightnessChange = (event) => {
    setBrightness(event.target.value);
  };

  const getData = async (type) => {
    setLoadingDetect(true);
    try {
      const responce = await fetch(`http://127.0.0.1:5000/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ URL: images[ind].original }),
      });
      const imageData = await responce.json();

      const rgbArray = imageData.image;

      const buffer = new Uint8Array(rgbArray).buffer;

      const blob = new Blob([buffer], { type: "image/png" });

      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result);
        setLoadingDetect(false);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.log("Error fetching img data:", error);
    }
  };

  const prev = () => {
    // if (ind === 0) {
    //   const idx = images.length - 1;
    //   setInd(images.length - 1);
    //   setUrl(images[idx].original);
    // } else {
    //   const idx = ind - 1;
    //   setInd(ind - 1);
    //   setUrl(images[idx].original);
    // }
    if (ind !== 0) {
      getImageFun(images[ind - 1]._id);
      setInd(ind - 1);
      onChangeType("close_all");
    }
  };

  const next = () => {
    // if (ind === images.length - 1) {
    //   const idx = 0;
    //   setInd(0);
    //   setUrl(images[idx].original);
    // }
    // else {
    //   const idx = ind + 1;
    //   setInd(ind + 1);
    //   setUrl(images[idx].original);
    // }
    if (ind < images.length - 1) {
      getImageFun(images[ind + 1]._id);
      setInd(ind + 1);
      onChangeType("close_all");
    }
  };

  return (
    <>
      <div className="align_main_dv">
        <div id="top_container">
          <img
            className="top_icon"
            onClick={() => goTo("home")}
            src={process.env.PUBLIC_URL + "/icons/home logo.jfif"}
            alt="home icon"
          />
        </div>
        <div className="polaroid">
          <div className="menu">
            <div className="imgClass" onClick={() => onChangeType("magnifier")}>
              <img
                src={process.env.PUBLIC_URL + "/icons/magnifier_glass_icon.png"}
                alt="magnifierIcon"
                width={"30px"}
              />
              <br />
              <span className="iconText">Magnifine Glass</span>
            </div>
            <div className="imgClass" onClick={() => onChangeType("crop")}>
              <img
                src={process.env.PUBLIC_URL + "/icons/crop_icon.png"}
                alt="cropIcon"
                width={"30px"}
              />
              <br />
              <span className="iconText">Crop</span>
            </div>
            <div
              className="imgClass"
              style={{
                display: `${type === "Rectangle" ? "block" : "none"}`,
                cursor: "pointer",
              }}
              onClick={() => onChangeType("rect")}
            >
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/icons/design_graphic_rectangle_transform_icon.png"
                }
                alt="rectangleIcon"
                width={"30px"}
              />
              <br />
              <span className="iconText">Rectangle Bounding Box</span>
            </div>
            <div
              className="imgClass"
              style={{
                display: `${type === "polygone" ? "block" : "none"}`,
                cursor: "pointer",
              }}
              onClick={() => {
                onChangeType("polygon");
              }}
            >
              <img
                src={process.env.PUBLIC_URL + "/icons/polygon_thin_icon.png"}
                alt="polygonIcon"
                width={"30px"}
              />
              <br />
              <span className="iconText">Polygon BB</span>
            </div>
            <div
              className="imgClass"
              style={{ display: `${annotType !== "doc" ? "block" : "none"}` }}
              onClick={() => onChangeType("detector")}
            >
              <img src="/icons/Eye.png" alt="detectorIcon" width={"30px"} />
              <br />
              <span className="iconText">Detector</span>
            </div>
            <div
              className="imgClass"
              style={{ display: `${annotType !== "doc" ? "block" : "none"}` }}
              onClick={() => onChangeType("annotation_copy")}
            >
              <img
                src="/icons/copy_of_annotaion_icon.png"
                alt="detectorIcon"
                width={"30px"}
              />
              <br />
              <span className="iconText">Copy of Annotation</span>
            </div>
            <div
              className="imgClass"
              style={{
                display: `${type === "polygone" ? "block" : "none"}`,
                cursor: "pointer",
              }}
              onClick={() => {
                handleUndo();
              }}
            >
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/icons/arrow_back_undo_left_navigation_icon.png"
                }
                alt="undoIcon"
                width={"30px"}
              />
              <br />
              <span className="iconText">Undo</span>
            </div>
            <div
              className="imgClass"
              style={{
                display: `${type === "polygone" ? "block" : "none"}`,
                cursor: "pointer",
              }}
              onClick={() => {
                handleRedo();
              }}
            >
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/icons/arrow_forward_redo_navigation_right_icon.png"
                }
                alt="redoIcon"
                width={"30px"}
              />
              <br />
              <span className="iconText">Redo</span>
            </div>
            <div
              className="imgClass"
              style={{
                cursor: "pointer",
              }}
              onClick={() => onChangeType("delete")}
            >
              <img
                src={process.env.PUBLIC_URL + "/icons/delete_garbage_icon.png"}
                alt="deleteIcon"
                width={"30px"}
              />
              <br />
              <span className="iconText">Delete</span>
            </div>
            <div className="imgClass" onClick={() => zoomIn()}>
              <img
                src={process.env.PUBLIC_URL + "/icons/zoom_in_icon.png"}
                alt="zoomin"
                width={"30px"}
              />
              <br />
              <span className="iconText">Zoom In</span>
            </div>
            <div className="imgClass" onClick={() => zoomOut()}>
              <img
                src={process.env.PUBLIC_URL + "/icons/zoom_out_icon.png"}
                alt="zoomout"
                width={"30px"}
              />
              <br />
              <span className="iconText">Zoom Out</span>
            </div>
            <div
              className="imgClass"
              style={{
                cursor: "pointer",
              }}
              onClick={() => onChangeType("brightness")}
            >
              <img
                src={
                  process.env.PUBLIC_URL + "/icons/contrast_brightness_icon.png"
                }
                alt="brightness"
                width={"30px"}
              />
              <br />
              <span className="iconText">Brightness</span>
            </div>
            <button
              onClick={() => onChangeType("close_all")}
              className="button2"
            >
              Close All
            </button>
          </div>
          {annotType === "doc" && <DocumentComp 
          scale={scale} 
          docMagnifierSec={docMagnifierSec} 
          brightness={brightness} 
          docAnnotationSec={docAnnotationSec} 
          setBrightness={setBrightness}
          rangSetting={rangSetting} 
          setDocMagnifierSec={setDocMagnifierSec}
          />}
          {annotType === "image" && (
            <div className={`main ${annotationSec ? "overflow_off" : null}`}>
              <div
                style={{
                  display: `${cropSec || magnifierSec ? "none" : "block"}`,
                  position: "relative",
                  width: "100%",
                  height: "88vh",
                  overflow: "hidden",
                }}
              >
                <img
                  style={{
                    width: "100%",
                    height: "88vh",
                    transform: `scale(${scale})`,
                    transformOrigin: "center",
                    filter: `brightness(${brightness}%)`,
                    objectFit: "cover",
                  }}
                  src={url}
                />
              </div>
              <div style={indicatorWrapper}>{`${ind + 1}/${
                images.length
              }`}</div>
              <div>
                <i
                  style={{ ...controller, left: "10px" }}
                  onClick={() => {
                    if (!loadindDetect) prev();
                  }}
                  className="bi bi-chevron-left"
                ></i>
                <i
                  style={{ ...controller, right: "10px" }}
                  onClick={() => {
                    if (!loadindDetect) next();
                  }}
                  className="bi bi-chevron-right"
                ></i>
              </div>

              {cropSec ? (
                <Cropper url={url} scale={scale} brightness={brightness} />
              ) : null}
              {annotationSec ? (
                <div style={annotWrapper}>
                  <Annotation
                    annotations={annotations}
                    value={annotation}
                    onChange={onChange}
                    onSubmit={onSubmit}
                    setAnnotData={setAnnotData}
                    isAnnotationCopy={isAnnotationCopy}
                    ind={ind}
                    images={images}
                  />
                </div>
              ) : null}

              {magnifierSec ? <MagnifierComp url={url} /> : null}

              {polygonSec && (
                <div
                  style={{
                    top: "25px",
                    left: "0px",
                    right: "0px",
                    bottom: "0px",
                    position: "absolute",
                  }}
                >
                  {/* <img src={defaultSrc} style={{width: '100%', height: '740px'}} alt='ploygonimg'></img>
                        <ReactPolygonDrawer 
                            width={400} 
                            height={400} 
                        /> */}
                  <Canvas
                    ref={canvasRef}
                    // videoSource={upImg}

                    imgBrightness={{
                      objectFit: "cover",
                      transform: `scale(${scale})`,
                      transformOrigin: "top left",
                      filter: `brightness(${brightness}%)`,
                    }}
                    setPolyAnnotData={setPolyAnnotData}
                  />
                </div>
              )}
              {rangSetting === 1 && (
                <input
                  style={{
                    bottom: "10px",
                    left: "10px",
                    zIndex: "10px",
                    position: "absolute",
                  }}
                  type="range"
                  id="brightnessRange"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={handleBrightnessChange}
                />
              )}
            </div>
          )}
          <div className="sidebar">
            <div className="drawer_header ">
              <div
                style={{
                  width: "180px",
                  height: "50vh",
                  color: "whitesmoke",
                  padding: "20px 30px 10px 0px",
                  fontSize: "16px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {!detectorSec ? (
                  <div>
                    {annotType == "image" && (
                      <>
                        <div className="pointer">
                          Number of Annotation <br />
                          {/* {annotData.length === 0 && polyAnnotData.length === 0
                    ? ": " + bbCount
                    : annotData.length !== 0
                    ? ": " + annotData.length
                    : ": " + 1} */}
                          {bbCount}
                          <br />
                          <br />
                          <br />
                        </div>
                        <div className="pointer">
                          Number of Img Annotated
                          <br />
                          <br />
                          <br />
                        </div>
                      </>
                    )}

                    <label className="pointer">Cropped/Saved Pictures</label>
                  </div>
                ) : (
                  <div>
                    <div>
                      <label className="pointer" onClick={() => Detector("OD")}>
                        {" "}
                        Object Detection{" "}
                      </label>
                      <br />

                      <br />
                      <br />
                      <br />
                    </div>
                    <div>
                      <label className="pointer" onClick={() => Detector("IS")}>
                        {" "}
                        Instance Segmentation
                      </label>
                      <br />
                      <br />
                      <br />
                      <br />
                    </div>
                    <div>
                      <label className="pointer" onClick={() => Detector("KP")}>
                        Keypoint Detection
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
