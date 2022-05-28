//JS file for Exam page
const video = document.getElementById("video");
const box1 = document.getElementsByClassName("box1");
//loading of all the APIs
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(startVideo);
//function for starting of video
function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}
//Paper submission on page reload
if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
  alert("Your paper is submitted due to detection of malpractice.");
  setInterval(() => {
    document.getElementById("myForm").submit();
  }, 1000);
}
//Paper submission on tab change
document.addEventListener("visibilitychange", () => {
  document.querySelector("title").textContent = "TABS CHANGED";
  alert("Your paper is submitted due to detection of malpractice.");

  setInterval(() => {
    document.getElementById("myForm").submit();
  }, 1000);
});
//Timer
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
//Give warnings
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
      //no face is visible
      alert("PLEASE BE VISIBLE IN CAMERA");

      NoOfAlert++;
    } else if (detections.length > 1) {
      //more than one face visible
      alert("More than one user detetcted");
      NoOfAlert++;
    } else {
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    }
    document.getElementById("ok").innerHTML = NoOfAlert;
    if (NoOfAlert > 50) {
      //Paper submission if No. of alerts is more than 50
      alert("Your paper is submitted due to detection of malpractice.");
      setInterval(() => {
        document.getElementById("myForm").submit();
      }, 1000);
    }
  }, 1000);
});
//No going back after paper submission
function preventBack() {
  window.history.forward();
}
setTimeout("preventBack()", 0);
window.onunload = function () {
  null;
};
