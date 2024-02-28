import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "./crop.css";

function generateDownload(canvas, crop) {
  if (!crop || !canvas) {
    return;
  }

  canvas.toBlob(
    (blob) => {
      const previewUrl = window.URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.download = "cropPreview.png";
      anchor.href = URL.createObjectURL(blob);
      anchor.click();

      window.URL.revokeObjectURL(previewUrl);
    },
    "image/png",
    1
  );
}

function setCanvasImage(image, canvas, crop) {
 
  if (!crop || !canvas || !image) {
    return;
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const ctx = canvas.getContext("2d");
  // refer https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
  const pixelRatio = window.devicePixelRatio;

  canvas.width = crop.width * pixelRatio * scaleX;
  canvas.height = crop.height * pixelRatio * scaleY;

  // refer https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";

  // refer https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );
}

export default function App({ url, scale, brightness }) {
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const [crop, setCrop] = useState({
    unit: "px",
    width: 30,
    aspect: undefined,
  });
  const [completedCrop, setCompletedCrop] = useState(null);

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    setCanvasImage(imgRef.current, previewCanvasRef.current, completedCrop);
  }, [completedCrop]);

  return (
    <div style={{width:'100%',height:'88vh',overflow:'hidden' }}>
      <ReactCrop
        src={url}
        crossorigin="anonymous"
        onImageLoaded={onLoad}
        crop={crop}
        ruleOfThirds={true}
        onChange={(c) => setCrop(c)}
        onComplete={(c) => setCompletedCrop(c)}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center",
          filter: `brightness(${brightness}%)`,
          objectFit: "cover",
        }}
      />
      <div>
        <canvas
          ref={previewCanvasRef}
          // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
          style={{
            // width: Math.round(completedCrop?.width ?? 0),
            // height: Math.round(completedCrop?.height ?? 0),
            width:'120px',
            height:'120px',
            position:'absolute',
            right:'-130px',
            bottom:'80px',
            borderRadius:'4px'
          }}
        />
        <div 
        disabled={!completedCrop?.width || !completedCrop?.height}
        onClick={() =>
          generateDownload(previewCanvasRef.current, completedCrop)
        }
         style={{ color:'white',
            position:'absolute',
            right:'-128px',
            bottom:'25px',
            padding:'4px 25px',
            borderRadius:'7px',
            cursor:'pointer',
            border:'2px solid white'}}>
            <i style={{marginRight:'12px'}} className="bi bi-download"></i>Save</div>
      </div>
    </div>
  );
}

