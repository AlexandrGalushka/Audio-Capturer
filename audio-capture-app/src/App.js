import React, { useState, useLayoutEffect } from 'react';
import './App.css';
import audioManager from './audioManager';

function App() {

  const [audioData, setAudioData] = useState([]);
  const [error, setError] = useState('');
  const [interval, setIntNumber] = useState(0);
  
  const handleClick = async () => {
    await audioManager.setupAudioSource();
    setIntNumber(setInterval(() => {
      try{
        let data = audioManager.getAudioData();
        setAudioData(data);
      } catch(e){
        setError(e.message)
      }
    }, 10));
  }

  const handleStop = () => {
    clearInterval(interval);
    setIntNumber(0);
    audioManager.disposeStream();
  }

  const RenderItem = ({ item }) => {
    const button = 
    console.log(button);
    return button;
  }

  console.log(audioData);
  return (
    <>
      <button onClick={handleClick}>Start</button>
      <button onClick={handleStop}>Stop</button>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        height: 'auto'
      }}>
        {audioData && audioData.map(audioDataChunk => 
        <div>
          <div>{`label: ${audioDataChunk.deviceTitle}`}</div>
          <div>{`kind: ${audioDataChunk.deviceKind}`}</div>
          <div>{`deviceId: ${audioDataChunk.deviceId.length > 20 ? audioDataChunk.deviceId.substring(0, 20) : audioDataChunk.deviceId}`}</div>
          <div style={{
            width: '512px',
            height: '256px',
            display:'flex',
            flexDirection:'row',
            margin: '5px'
            
          }}>
              {Array.from(audioDataChunk.dataArray).map(item =><div style={{ width: '5px', height: `${item}px`, backgroundColor: 'red'}}></div>)}
          </div>
        </div>
        )}
      </div>
      
      <div>
        {error}
      </div>
    </>
  );
}

export default App;
