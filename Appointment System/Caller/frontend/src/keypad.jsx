import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { socket } from './Socket.js';
import { speakText } from './helper';

function Keypad() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [call, setCall] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleNumber = (keyVal) => {
    if (phoneNumber.length === 10) {
      return;
    }
    setPhoneNumber(phoneNumber + keyVal);
  };

  const handleClear = () => {
    if (phoneNumber.length === 0) {
      return;
    }
    setPhoneNumber(phoneNumber.slice(0, -1));
  };

  const handleEndCallBtn = () => {
    callDisconnect();
  };
  const handleCallBtn = () => {
    console.log('Call Button Clicked');
    if (phoneNumber.length !== 10) {
      alert('Please enter correct phone number');
      return;
    }

    callConnect();
  };

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
    <div>
      {isRecording ? (
        <div className="bg-red-500 h-1 w-1 rounded-full"></div>
      ) : (
        <></>
      )}
      <div className="wrapper">
        <div className="phone">
          <span className="title">Phone Keyboard</span>

          <div className="phone-container ">
            <input
              type="text"
              maxLength="11"
              className="number-input"
              id="numberInput"
              value={phoneNumber}
              placeholder="Phone Number"
            />

            <div className="keyboard">
              <div className="number">
                <span
                  data-number="1"
                  onClick={() => {
                    handleNumber(1);
                  }}
                >
                  <i>1</i>
                </span>
                <span
                  data-number="2"
                  onClick={() => {
                    handleNumber(2);
                  }}
                >
                  <i>2</i>
                </span>
                <span
                  data-number="3"
                  onClick={() => {
                    handleNumber(3);
                  }}
                >
                  <i>3</i>
                </span>
                <span
                  data-number="4"
                  onClick={() => {
                    handleNumber(4);
                  }}
                >
                  <i>4</i>
                </span>
                <span
                  data-number="5"
                  onClick={() => {
                    handleNumber(5);
                  }}
                >
                  <i>5</i>
                </span>
                <span
                  data-number="6"
                  onClick={() => {
                    handleNumber(6);
                  }}
                >
                  <i>6</i>
                </span>
                <span
                  data-number="7"
                  onClick={() => {
                    handleNumber(7);
                  }}
                >
                  <i>7</i>
                </span>
                <span
                  data-number="8"
                  onClick={() => {
                    handleNumber(8);
                  }}
                >
                  <i>8</i>
                </span>
                <span
                  data-number="9"
                  onClick={() => {
                    handleNumber(9);
                  }}
                >
                  <i>9</i>
                </span>
              </div>
              <div className="number aling-right">
                {call ? (
                  <span data-number="0" onClick={handleEndCallBtn}>
                    <i>End</i>
                  </span>
                ) : (
                  <span data-number="0" onClick={handleCallBtn}>
                    <i>call</i>
                  </span>
                )}

                <span
                  data-number="0"
                  onClick={() => {
                    handleNumber(0);
                  }}
                >
                  <i>0</i>
                </span>
                <span data-number="0" onClick={handleClear}>
                  <i>clear</i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Keypad;
