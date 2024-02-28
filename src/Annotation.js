import React, { memo,useState, useEffect } from "react";
import { ReactPictureAnnotation } from "react-picture-annotation";
import Dropdown from "./dropdown";
import "./Annotation.css";

const Annotation = ({ ind, images, isAnnotationCopy }) => {
  const [arrState, setArrState] = useState([]);
  const [pageSize, setPageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const BASE_URL = 'http://127.0.0.1:5000';
  const [inputText, setInputText] = useState("");

  const onResize = () => {
    setPageSize({ width: window.innerWidth, height: window.innerHeight });
  };

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onSelect = (e, selectedId) => {
    // console.log("onSelect", selectedId, "e", e);
  };

  const onChange = (data) => {
    // console.log("onChange", data);
    setArrState(data);
  };

  const handleInputSubmit = () => {
    if (inputText) {
      const newAnnotation = {
        id: `${Math.random()}`,
        mark: {
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          type: "RECT",
        },
        comment: inputText,
      };

      setArrState([...arrState, newAnnotation]);
      setInputText("");
    }
  };

  const updateCoordinates = (coordsValue) => {
    const payload = { id: images[ind]._id, coordinateData: coordsValue }
    fetch(BASE_URL + '/updateCoordinate', {
      method: "Post",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(res => res.json())
      .then(output => console.log('output', output))
      .catch(err => console.log('error', err))

  }

  const fetchCoordinate = () => {
    const payload = { id: images[ind]._id};
    fetch(BASE_URL + '/getCoordinate', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(res=>res.json())
    .then(output=>{
      console.log('fCodres',output)
      if(output)setArrState(output.coordinates)})
    .catch(err=>console.log('error',err))
  }

  useEffect(() => {
    if (isAnnotationCopy) {
      fetchCoordinate();
    }else{
      setArrState([]);
    }
  }, [isAnnotationCopy])

  useEffect(() => {
    if (arrState) {
      const lastObj = arrState[arrState.length - 1]
      const commentPresent = lastObj?.comment
      if (commentPresent !== undefined)
        updateCoordinates(arrState);
    }
  }, [arrState]);

  return (
    <div className="annotation">
      <ReactPictureAnnotation
        annotationData={arrState}
        inputElement={(value, onChange) => (
          <Dropdown
            value={value}
            onChange={onChange}
            onInputTextChange={(text) => setInputText(text)}
            onInputSubmit={handleInputSubmit}
          // options={props.options}
          />
        )}
        // image={props.src}
        onSelect={onSelect}
        onChange={onChange}
        width={pageSize.width}
        height={pageSize.height}
        onWheel={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default memo(Annotation);
