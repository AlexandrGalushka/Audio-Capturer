

class AudioManager{
  constructor(){
    this.streams = [];
  }

  async setupAudioSource(){
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter(d => d.kind.indexOf('audio') !== -1);

    if(!audioDevices.length === 0){
      throw new Error('No system audio input device found!');
    }

    try{
      await Promise.all(audioDevices.map(async d => {
        const audioStream = await navigator.mediaDevices.getUserMedia({ 
          video: false, 
          audio: { 
            deviceId: d.deviceId 
          }
        });
        const stream = new Stream(audioStream, d);
        this.streams.push(stream);
      }))
    } catch(e){
      throw e;
    }
  }

  disposeStreams(){
    this.streams.forEach(s => s.stream ? s.stream.getTracks().forEach(t => t.stop()) : null);
    this.streams = [];
  }

  getAudioData(){
    
    if (this.streams.length == 0){
      throw new Error('Streams length is 0');
    }
    return this.streams.map(stream => ({
      dataArray: stream.getData(),
      deviceTitle: stream.device.label,
      deviceKind: stream.device.kind,
      deviceId: stream.device.deviceId
    }));
  }
}

class Stream{
  constructor(stream: MediaStream, device: MediaDeviceInfo){
    if (!stream)
      throw new Error('Stream is not valid!');

    this.device = device
    this.stream = stream
    this.audioContext = new AudioContext();
    this.analyzer = this.audioContext.createAnalyser();
    this.analyzer.fftSize = 256;
    this.audioSource = this.audioContext.createMediaStreamSource(this.stream);
    this.audioSource.connect(this.analyzer);

  }

  getData(){
    if (!this.stream || !this.audioContext || !this.analyzer || !this.audioSource){
      throw new Error('Audio stream is not defined!');
    }
    let arr = new Uint8Array(256);
    this.analyzer.getByteTimeDomainData(arr);
    return arr;
  }
}


const audioManager = new AudioManager();

export default audioManager;