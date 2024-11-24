import { useEffect, useState, useCallback } from 'react';
import { socket } from './Socket.js';
import { speakText } from './helper.js';

function App() {
  const [call, setCall] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [phoneNumber, setPhoneNumber] = useState('9876543211');

  // Function to play audio from text

  const callDisconnect = useCallback(() => {
    setCall(false);
    socket.disconnect();
    socket.off('speak');
  }, []);

  const callConnect = () => {
    setCall(true);
    socket.connect();
    socket.emit('phoneNumber', { phoneNumber: phoneNumber });
  };

  const createMediaRecorder = async (stream) => {
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      setAudioBlob(audioBlob);
      setIsRecording(false);
      stream.getTracks().forEach((track) => track.stop());
    };

    return mediaRecorder;
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser doesn't support audio recording.");
      return;
    }

    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = await createMediaRecorder(stream);
      mediaRecorder.start();

      // Stop recording after 5 seconds
      setTimeout(() => {
        mediaRecorder.stop();
        setIsRecording(false);
      }, 5000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsRecording(false);
    }
  };

  // Emit audioBlob when it is updated and call is active
  useEffect(() => {
    const sendAudio = async () => {
      if (audioBlob && call) {
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64AudioMessage = reader.result.split(',')[1];
          socket.emit('call', { audio: base64AudioMessage });
        };
      }
    };

    sendAudio();
  }, [audioBlob, call]);

  useEffect(() => {
    const handleSpeak = async (data) => {
      console.log(data?.message);

      await speakText(data?.message);

      if (data?.continue_conversation) {
        startRecording();
      } else {
        callDisconnect();
      }
    };

    if (call) {
      socket.on('speak', handleSpeak);
    }

    return () => {
      socket.off('speak', handleSpeak);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [call, callDisconnect]);

  return (
    <>
      {isRecording ? (
        <div className="bg-red-500 h-1 w-1 rounded-full"></div>
      ) : (
        <></>
      )}
      {!call ? (
        <h1 className="btn" onClick={callConnect}>
          Call
        </h1>
      ) : (
        <h1 className="btn" onClick={callDisconnect}>
          Not Call
        </h1>
      )}
    </>
  );
}

export default App;
