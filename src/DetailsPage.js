import React, { useEffect, useState } from 'react'
import { useLocation, useParams,useNavigate } from 'react-router-dom';

const DetailsPage = () => {
  const {state} = useLocation();
  const location = useLocation();
  const navigation = useNavigate();
  const { numberOfBoundingBox, TypeOfBoundingBox, annotationStatus, image, name, url } = state.info
  const [status, setStatus] = useState(annotationStatus);
  const [numOfImages, setNumOfImages] = useState(image);
  const [numOfBBox, setNumOfBBox] = useState(numberOfBoundingBox);
  const [folderName, setFolderName] = useState(name);
  const [typeOfBBox, setTypeOfBBox] = useState(TypeOfBoundingBox);
  const [folderUrl, setFolderUrl] = useState(url);
  const box = { width: '25%', padding: '5px', backgroundColor: 'white', borderRadius: '4px' };

  const currentURL = location.pathname.split('/');
  const dynamicRoute = `/${currentURL[1]}/${currentURL[2]}/${currentURL[3]}/${currentURL[4]}/${currentURL[5]}/${currentURL[6]}/layout`;
  const navigateTo = () =>{
    navigation(dynamicRoute, {state});
  }

  
  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: 'rgb(71 60 138)', }}>
      <marquee
        width="98%"
        direction="left"
        height="100px"
        className="floating-text"
      >
        <h1 className="header">Annotation Tool Component</h1>
      </marquee>
      <div style={{ width: '80%', margin: '0px auto 0px auto', padding: '20px', textAlign: 'center', borderRadius: '7px' }}>
        <label style={{ fontSize: '22px', fontWeight: '600', color: 'white' }}>{typeOfBBox} Tagging</label>
        <div style={{ width: '100%', padding: '1px 0px 30px 0px', textAlign: 'center', margin: '30px 0px', backgroundColor: 'white', borderRadius: '4px' }}>
          <h4>{folderName}</h4>
          <label>{folderUrl}</label>
        </div>
        <div style={{ width: '100%', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', margin: '30px 0px' }}>
          <div style={box}>
            <h5>Status</h5>
            <h5>{status}</h5>
          </div>
          <div style={box}>
            <h5>Number of Images</h5>
            <h5>{numOfImages}</h5>
          </div>
          <div style={box}>
            <h5>Number of Annotation</h5>
            <h5>{numOfBBox}</h5>
          </div>
        </div>
        <div className='detailsbtn' onClick={navigateTo} style={{ width: 'fit-content', padding: '9px 50px', cursor: 'pointer', margin: '45px auto', backgroundColor: 'gray' }}>Submit Folder For Review</div>
      </div>
    </div>
  )
}

export default DetailsPage;
