

class AudioManager{
  constructor(){
    this.audioContext = null;
    this.audioSource = null;
    this.analyzer = null;
    this.audioStream = null;
  }

  async setupAudioSource(){
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputDevice = devices.find(d => d.kind === 'audioinput' && d.deviceId === 'communications');

    if(!audioInputDevice){
      throw new Error('No system audio input device found!');
    }
    try{
      this.audioStream = await navigator.mediaDevices.getUserMedia({ 
        video: false, 
        audio: { 
          deviceId: audioInputDevice.deviceId 
        }
      });

      this.audioContext = new AudioContext();

      this.analyzer = this.audioContext.createAnalyser();
      this.analyzer.fftSize = 256;

      this.audioSource = this.audioContext.createMediaStreamSource(this.audioStream);
      this.audioSource.connect(this.analyzer);

    } catch(e){
      throw e;
    }
  }

  disposeStream(){
    this.audioStream = null;
    this.audioContext = null;
    this.analyzer = null;
    this.audioSource = null;
  }

  getAudioData(){
    if (!this.audioStream || !this.audioContext || !this.analyzer || !this.audioSource){
      throw new Error('Audio stream is not defined!');
    }

    let arr = new Uint8Array(256);
    this.analyzer.getByteTimeDomainData(arr);

    return arr;
  }
}

const audioManager = new AudioManager();

export default audioManager;