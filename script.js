const video = document.getElementById('video');

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.tinyRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
]).then(startVideo)

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        error => console.error(error)
    )
}

 video.addEventListener('play', () => {
     const canvas = faceapi.createCanvasFromMedia(video)
     document.body.append(canvas)
     const displaySize = { width: video.width, height: video.height }
     faceapi.matchDimensions(canvas, displaySize)
    setInterval( async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyDetectorOptions()).withFaceLandmarks().withFaceExpressions().withFaceExpressions()
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        const resizedDetections = faceapi.resizedResults(detections, displaySize)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas.resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100)
})