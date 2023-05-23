import React, { useState, useRef } from 'react';
import axios from 'axios';
import './recorder.css'
function Recorder() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const audioRef = useRef<MediaRecorder | null>(null);
  const [apiResponse, setApiResponse] = useState({ rawSpeechText: 'hello teher aas da asd ad ', entity: {} });

  const startRecording = () => {
    setRecording(true);

    const constraints = { audio: true };
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        setStream(stream);
        audioRef.current = new MediaRecorder(stream);

        const chunks: BlobPart[] = [];
        audioRef.current.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        audioRef.current.onstop = () => {
          setRecording(false);
          const blob = new Blob(chunks, { type: 'audio/wav' });
          setAudioBlob(blob);
        };

        audioRef.current.start();
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
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
    formData.append('file', audioBlob, 'recording.wav');

    axios.post('http://localhost:5000/search/speech', formData)
      .then((response) => {
        console.log('Audio uploaded successfully:', response.data);
        setApiResponse(response.data);
      })
      .catch((error) => {
        console.error('Error uploading audio:', error);
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

function App() {
  return (
    <div className="App">
      <Recorder />
    </div>
  );
}

export default App;
