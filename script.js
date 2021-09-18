
const video = document.getElementById('video')
const capture = document.getElementById('capture-btn')
const timer = document.getElementById('timer')

const setTimer = () => {
  timer.style.display = 'block'
  timeLeft = 10;
  function countdown() {
    timeLeft--;
    timer.innerHTML = String(timeLeft);
    if (timeLeft > 0) {
      setTimeout(countdown, 1000);
    }
  };
  setTimeout(countdown, 1000);
}

const startProcess = async () => {
  let predictedEspression;
  //turning on camera and taking usre input
  const mediaStream = navigator.getUserMedia(
    { video: {} },
    await function (stream) {
      video.srcObject = stream
      console.log(stream)
    },
    err => console.error(err)
  )

  // setting up timer here : 
  setTimer();

  // loading models for face exp recognition
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    await faceapi.nets.faceExpressionNet.loadFromUri('/models')

  const detectExpression = async () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    console.log('detection function trigerred')
    setInterval( async () => {
       let detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
       if (detections.length) {
          const obj = detections[0].expressions
          let maxvalueExp = _.last(_.sortBy(obj))
          for (property in obj) {
            if (obj[property] === maxvalueExp) {
               predictedEspression = property
            }
          }
       }
       const resizedDetections = faceapi.resizeResults(detections, displaySize)
       canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
       faceapi.draw.drawDetections(canvas, resizedDetections)
       faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
       let faceExp = faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 500)
  }
  video.addEventListener('play', detectExpression)
  const captureImageExpressions = async () => {
    video.style.display = 'none'
    if ( predictedEspression === 'happy' ){
      window.open('http://127.0.0.1:5500/pages/recommendation.html', '_blank');
    }
    if ( predictedEspression === 'sad' ){
      window.open('http://127.0.0.1:5500/pages/recommendation.html', '_blank');
    }
    if ( predictedEspression === 'neutral' ){
      window.open('http://127.0.0.1:5500/pages/recommendation.html', '_blank');
    }
    if ( predictedEspression === 'angry' ){
      window.open('http://127.0.0.1:5500/pages/recommendation.html', '_blank');
    }
    if ( predictedEspression === 'disgusted' ){
      window.open('http://127.0.0.1:5500/pages/recommendation.html', '_blank');
    }
    if ( predictedEspression === 'surprised' ){
      window.open('http://127.0.0.1:5500/pages/recommendation.html', '_blank');
    }
    if ( predictedEspression === 'fearful' ){
      window.open('http://127.0.0.1:5500/pages/recommendation.html', '_blank');
    }
    await location.reload()
  }
  capture.addEventListener('click', captureImageExpressions)
}

for (let index = 0; index < 2; index++) {
  let getStartedBtn = document.getElementsByClassName('get-started-btn')[index]
  console.log(getStartedBtn)
  getStartedBtn.addEventListener('click', startProcess);
}


