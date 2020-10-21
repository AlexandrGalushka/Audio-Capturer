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
      console.log('ping')
      try{
        let data = audioManager.getAudioData();
        console.log(data);
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

  return (
    <>
      <button onClick={handleClick}>Start</button>
      <button onClick={handleStop}>Stop</button>
      <div style={{
        width: '512px',
        height: '256px',
        display:'flex',
        flexDirection:'row'
      }}>
          {Array.from(audioData).map(item =><div style={{ width: '5px', height: `${item}px`, backgroundColor: 'red'}}></div>)}
      </div>
      <div>
        {error}
      </div>
    </>
  );
}

export default App;
