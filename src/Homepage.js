import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "./layout";

function callRectangleAPI() {
  fetch(
    "http://localhost:3000/1080/doc/reactangle/projectone/taskone/folderone"
  )
    .then((response) => response.text())
    .then((data) => {
      console.log("Rectangle API Response:", data);
    })
    .catch((error) => {
      console.error("Error calling Rectangle API:", error);
    });
}

function callPolygonAPI() {
  fetch("http://localhost:3000/1080/doc/polygon/projectone/taskone/folderone")
    .then((response) => response.json())
    .then((data) => {
      console.log("Polygon API Response:", data);
    })
    .catch((error) => {
      console.error("Error calling Polygon API:", error);
    });
}

function Homepage() {
  const [type, setType] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const currentURLH = location.pathname;

  return (
    <div className="Homepage">
      {type ? null : <div>
        <marquee
          width="98%"
          direction="left"
          height="100px"
          className="floating-text"
        >
          <h1 className="header">Annotation Tool Component</h1>
        </marquee>
        <h1 className="h1">What would you like to do ?</h1>
        <div className="option">
          <Button
            style={{ cursor: "pointer" }}
            variant="contained"
            //onClick={()=>{callRectangleAPI(); setType('rectangle')}}
            onClick={() => { navigate(`${currentURLH}/rect`); setType('rectangle') }}
          >
            Rectangle Bounding Box
          </Button>
          <Button
            style={{ cursor: "pointer" }}
            variant="contained"
            //onClick={()=>{callPolygonAPI(); setType('polygone')}}
            onClick={() => { navigate(`${currentURLH}/poly`); setType('polygone') }}
          >
            Polygon Bounding Box
          </Button>
        </div>
      </div>}
      {type ? <Layout type={type} /> : null}
    </div>
  );
}

export default Homepage;
