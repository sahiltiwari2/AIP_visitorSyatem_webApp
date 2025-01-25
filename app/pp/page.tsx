"use client";

import { useState } from "react";

export default function VisitorPhotoSystem() {
  const [email, setEmail] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const captureImage = async (videoRef: HTMLVideoElement | null) => {
    if (videoRef) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.videoWidth;
      canvas.height = videoRef.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef, 0, 0, canvas.width, canvas.height);
      } else {
        console.error("Failed to get 2D context");
      }
      const imageData = canvas.toDataURL("image/png" ) ;
      setImage(imageData);

      // Save image to public folder
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
        alert("Image saved successfully!"); //Toast Here
      } else {
        alert("Failed to save image.");
      }

      setIsCameraOpen(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <h1 className="text-2xl font-bold">Visitor Photo System</h1>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded-lg w-64"
      />

      <button
        onClick={openCamera}
        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Open Camera
      </button>

      {isCameraOpen && (
        <div className="flex flex-col items-center space-y-2">
          <video
            autoPlay
            playsInline
            ref={(videoRef) => {
              if (videoRef) {
                navigator.mediaDevices
                  .getUserMedia({ video: true })
                  .then((stream) => {
                    videoRef.srcObject = stream;
                  });
              }
            }}
            className="w-100 h-80 border rounded-lg"
          ></video>
          <button
            onClick={() => captureImage(document.querySelector("video"))}
            className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
          >
            Capture Image
          </button>
        </div>
      )}

      {image && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Captured Image:</h2>
          <img
            src={image}
            alt="Captured"
            className="w-100 h-80 border rounded-lg"
          />
        </div>
      )}
    </div>
  );
}