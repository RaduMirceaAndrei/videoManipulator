(function(){
    navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia ||
        navigator.mediaDevices.webkitGetUserMedia ||
        navigator.mediaDevices.mozGetUserMedia;

    var canvas = document.querySelector('#canvas'),
        context = canvas.getContext('2d');

    function startRecording(){
        if(navigator.mediaDevices.getUserMedia){
            let constraints = {
                audio: true,
                video: {
                    width: 400,
                    height: 400
                }
            };
            navigator.mediaDevices.getUserMedia(constraints)
            .then(function(mediaStream) {
                console.log(typeof mediaStream); //object - blob ??
                var video = document.querySelector('#video');
                video.src = window.URL.createObjectURL(mediaStream);
                video.onloadedmetadata = function(e) {
                    document.querySelector('#video').addEventListener('play', function(){
                        window.requestAnimationFrame(() => {
                            draw(this, context, 640, 480);
                        });
                    }); //maybe move this
                    video.play();
                    // Do something with the video here.
                };
            })
            .catch(function(error) {
                if(error.errorName == 'PermissionDeniedError'){
                    let response = confirm('You need to give permissions to the app to access the mic and camera.');
                    if(response == true){
                        startRecording();
                    }
                }            
            });        
        } else {
            document.write('Your browser does not support')
        }
    }

    function draw(v,c,w,h) {
        if(v.paused || v.ended) return false;
        c.drawImage(v,0,0,w,h);
        setTimeout(draw,20,v,c,w,h);
    }

    /*
    var options = {mimeType: 'video/webm; codecs=vp9'};

    mediaRecorder = new MediaRecorder(stream, options);

    var options;
    if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        options = {mimeType: 'video/webm; codecs=vp9'};
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        options = {mimeType: 'video/webm; codecs=vp8'};
    } else {
        options = {mimeType: 'video/webm'}
    }
    */
    //init
    startRecording();
})();