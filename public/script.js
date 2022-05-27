const video = document.getElementById("video");
const box1 = document.getElementsByClassName("box1");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
  alert("Your paper is submitted due to detection of malpractice.")
   setInterval(() => {
    document.getElementById("myForm").submit();
   }, 1000); 
}
document.addEventListener("visibilitychange", () => {
    document.querySelector('title').textContent = "TABS CHANGED";
    alert("Your paper is submitted due to detection of malpractice.")

   setInterval(() => {
    document.getElementById("myForm").submit();
   }, 4000); 
});

var secs = 59;
var hour = 59;

var downloadTimer = setInterval(function () {
  if (secs == 0 && hour == 0) {
    clearInterval(downloadTimer);
    document.getElementById("countdown").innerHTML = "Finished";
    window.alert("TIME OVER");
    document.getElementById("myForm").submit();
  } else {
    document.getElementById("countdown").innerHTML =
      "Time Left " + hour + ":" + secs;
  }
  secs -= 1;
  if (secs == 0 && hour > 0) {
    hour -= 1;
    secs = 59;
  }
}, 1000);
var NoOfAlert = 0;
video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    if (detections.length == 0) {
      alert("PLEASE BE VISIBLE IN CAMERA");

      NoOfAlert++;
    } else if (detections.length > 1) {
      alert("More than one user detetcted");
      NoOfAlert++;
    } else {
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    }
    document.getElementById("ok").innerHTML = NoOfAlert;
    if(NoOfAlert>50){
      alert("Your paper is submitted due to detection of malpractice.")
   setInterval(() => {
    document.getElementById("myForm").submit();
   }, 4000); 

    }
  }, 100);
});
