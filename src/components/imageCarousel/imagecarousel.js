import React, { useState, useEffect } from 'react';
import ReactCrop from "react-image-crop";

const ImageCarousel = () => {
  const [scale, setScale] = useState(1);
  const defaultScale = 1.0;
  const images = [
    {
      original: "https://picsum.photos/id/1015/1000/600/",
      thumbnail: "https://picsum.photos/id/1015/250/150/",
    },
    {
      original: "https://picsum.photos/id/1019/1000/600/",
      thumbnail: "https://picsum.photos/id/1019/250/150/",
    },
    {
      original: "https://picsum.photos/seed/picsum/1000/600",
      thumbnail: "https://picsum.photos/seed/picsum/250/150/",
    },
  ];
  
  return (
    <div id="demo" className="carousel" data-ride="carousel" data-interval="0">  
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src="https://picsum.photos/id/1018/1000/600/" alt="Los Angeles" width="1000" height="500"></img>
        </div>
        {images.map((image, index) => (
             <div className="carousel-item" key={index}>
                <img src={image.original} 
                  alt="Chicago" 
                  width="1000" 
                  height="500"
                  style={{
                    transform: `scale(${scale})`,
                    objectFit: "cover"
                  }}></img>
             </div>
          ))}
      </div>
  
  
      <a className="carousel-control-prev" href="#demo" data-slide="prev">
        <span className="carousel-control-prev-icon"></span>
      </a>
      <a className="carousel-control-next" href="#demo" data-slide="next">
        <span className="carousel-control-next-icon"></span>
      </a>
    </div>
  );
};


export default ImageCarousel;
