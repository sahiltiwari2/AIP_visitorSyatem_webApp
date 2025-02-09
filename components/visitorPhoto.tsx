"use client";

import { useEffect, useRef, useState } from "react";

type VisitorPhotoSystemProps = {
  email: string;
};

export default function VisitorPhotoSystem({ email }: VisitorPhotoSystemProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
  };

  const captureImage = async () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      }
      const imageData = canvas.toDataURL("image/png");
      setImage(imageData);

      const response = await fetch("/api/save-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          image: imageData,
        }),
      });

      if (response.ok) {
        alert("Image saved successfully!");
      } else {
        alert("Failed to save image.");
      }

      closeCamera();
    }
  };

  useEffect(() => {
    if (isCameraOpen && videoRef.current) {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Your browser does not support camera access.");
        closeCamera();
        return;
      }

      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current!.srcObject = stream;
        })
        .catch((error) => {
          console.error("Error accessing the camera:", error);
          closeCamera();
        });
    }
  }, [isCameraOpen]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 mb-5">
      <button
        onClick={openCamera}
        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 w-full h-12 text-xl mb-5"
      >
        Open Camera
      </button>

      {isCameraOpen && (
        <div className="flex flex-col items-center space-y-2">
          <video
            autoPlay
            playsInline
            ref={videoRef}
            className="w-100 h-80 border rounded-lg"
          ></video>
          <div className="flex  w-full gap-2">
            <button
              onClick={captureImage}
              className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 w-full h-12 text-xl "
            >
              Capture Image
            </button>
            <button
              onClick={closeCamera}
              className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 w-full h-12 text-xl"
            >
              Close Camera
            </button>
          </div>
        </div>
      )}

      {image && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Captured Image:</h2>
          <img
            src={image}
            alt="Captured"
            className="w-100 h-80 border rounded-lg mb-5"
          />
        </div>
      )}
    </div>
  );
}