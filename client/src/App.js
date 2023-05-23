import React, { useState, useRef } from "react";
import axios from "axios";
import "./recorder.css";

let api = 'https://speech-beta.jaga.live/api';

function Recorder() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [stream, setStream] = useState(null);
  const audioRef = useRef(null);
  const [apiResponse, setApiResponse] = useState({
    rawSpeechText: "Raw text from Speech API",
    entity: {},
  });

  const startRecording = () => {
    setRecording(true);

    const constraints = { audio: true };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        setStream(stream);
        audioRef.current = new MediaRecorder(stream);

        const chunks = [];
        audioRef.current.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        audioRef.current.onstop = () => {
          setRecording(false);
          const blob = new Blob(chunks, { type: "audio/wav" });
          setAudioBlob(blob);
        };

        audioRef.current.start();
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const stopRecording = () => {
    if (audioRef.current) {
      audioRef.current.stop();
    }
  };

  const uploadAudio = () => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.wav");

      axios
        .post(`${api}/search/speech`, formData)
        .then((response) => {
          console.log("Audio uploaded successfully:", response.data);
          setApiResponse(response.data);
        })
        .catch((error) => {
          console.error("Error uploading audio:", error);
        });
    }
  };

  return (
    <div className="recorder">
      <div className="recorder-controls">
        <button onClick={startRecording} disabled={recording}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={!recording}>
          Stop Recording
        </button>
        <button onClick={uploadAudio} disabled={!audioBlob}>
          Upload Audio
        </button>
      </div>
      {apiResponse.rawSpeechText && (
        <div className="api-response">
          <h2>API Response</h2>
          <p>Raw Speech Text: {apiResponse.rawSpeechText}</p>
          <pre>{JSON.stringify(apiResponse.entity, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <Recorder />
    </div>
  );
}
