if ($(".camera_stream").length) {
  // References to all the element we will need.
  var video = document.querySelector("._camera_video"),
    image = document.querySelector("._camera_snap"),
    imageBack = document.querySelector("._camera_snap_back"),
    controls = document.querySelector("._camera_controls"),
    frame = document.querySelector("._camera_frame"),
    take_photo_btn = document.querySelector("._take_photo"),
    delete_photo_btn = document.querySelector("._delete_photo"),
    use_photo_btn = document.querySelector("._use_photo"),
    error_message = document.querySelector("._camera_message"),
    camera_title = document.querySelector("._camera_title"),
    camera_rotate_btn = document.querySelector("._rotate_side"),
    camera_container = document.querySelector(".camera_stream");
  var localStream, savePhotoSrc, saveBackPhotoSrc, saveRelatedTarget, action, group, title;

  var side = 'front',
    isFrontSnapExist = false,
    isBackSnapExist = false;

  if (camera_rotate_btn) {
    initialText = camera_rotate_btn.innerText
  }

  navigator.getMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  function takePhoto() {
    var snap = takeSnapshot();

    // Show image.
    frame.classList.remove("visible");

    // Enable delete and save buttons
    controls.classList.add("visible");
    take_photo_btn.classList.remove("visible");
    camera_container.classList.add('camera_stream--snap');
    if (camera_rotate_btn) camera_rotate_btn.classList.add("visible");

    // Set the href attribute of the download button to the snap url.
    // Pause video playback of stream.

    if (side === 'front') {
      isFrontSnapExist = true;
      image.setAttribute("src", snap);
      image.classList.add("visible");
      savePhotoSrc = snap;
    } else {
      imageBack.setAttribute("src", snap);
      imageBack.classList.add("visible");
      isBackSnapExist = true;
      saveBackPhotoSrc = snap;
    }

    console.log('isBackSnapExist: ', isBackSnapExist, 'isFrontSnapExist: ', isFrontSnapExist)

    if (isFrontSnapExist && isBackSnapExist) {
      video.classList.remove("visible");
      video.pause();
    }
  }

  function showVideo() {
    controls.classList.remove("visible");
    frame.classList.add("visible");
    take_photo_btn.classList.add("visible");
    video.classList.add("visible");
    error_message.classList.remove("visible");
  }

  function takeSnapshot() {
    // Here we're using a trick that involves a hidden canvas element.

    var hidden_canvas = document.querySelector("canvas"),
      context = hidden_canvas.getContext("2d");

    var width = video.videoWidth,
      height = video.videoHeight;

    if (width && height) {
      // Setup a canvas with the same dimensions as the video.
      hidden_canvas.width = width;
      hidden_canvas.height = height;

      // Make a copy of the current frame in the video on the canvas.
      context.drawImage(video, 0, 0, width, height);

      // Turn the canvas image into a dataURL that can be used as a src for our photo.
      return hidden_canvas.toDataURL("image/png");
    }
  }

  function deletePhoto() {
    video.play();
    toggleUIOnDelete()

    if (side === 'front') {
      image.setAttribute("src", "");
      image.classList.remove("visible");
      isFrontSnapExist = false
    } else {
      imageBack.setAttribute("src", "");
      imageBack.classList.remove("visible");
      isBackSnapExist = false
      if (camera_rotate_btn) camera_rotate_btn.classList.add("visible");
    }

    if (!isFrontSnapExist && !isBackSnapExist) {
      camera_container.classList.remove('camera_stream--snap');
    }
  }

  function toggleUIOnDelete() {
    if (isBackSnapExist && isFrontSnapExist) {
      take_photo_btn.classList.add("visible");
      controls.classList.remove("visible");
      if (camera_rotate_btn) camera_rotate_btn.classList.add("visible");
    }
    else {
      controls.classList.remove("visible");
      frame.classList.add("visible");
      take_photo_btn.classList.add("visible");
      if (camera_rotate_btn) camera_rotate_btn.classList.remove("visible");
    }
  }

  function displayErrorMessage(error_msg, error) {
    error = error || "";
    if (error) {
      console.error(error);
    }

    error_message.innerText = error_msg;

    hideUI();
    error_message.classList.add("visible");
  }

  function hideUI() {
    controls.classList.remove("visible");
    take_photo_btn.classList.remove("visible");
    video.classList.remove("visible");
    error_message.classList.remove("visible");
    frame.classList.remove("visible");
    image.setAttribute("src", "");
    image.classList.remove("visible");
  }

  function initCamera() {
    // The getUserMedia interface is used for handling camera input.
    // Some browsers need a prefix so here we're covering all the options

    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { audio: false, video: { facingMode: "user" } },
        function(stream) {
          localStream = stream;
          video.srcObject = stream;
          video.onloadedmetadata = function(e) {
            video.play();
            video.onplay = function() {
              showVideo();
            };
          };
        },
        function(err) {
          displayErrorMessage(
            "There was an error with accessing the camera stream: " +
            err.name +
            ". Try to use another browser or Lykke Wallet App.",
            err
          );
          console.log("The following error occurred: " + err.name);
        }
      );
    } else {
      displayErrorMessage(
        "Your browser doesn't support the navigator.getUserMedia interface. Try to use another browser or Lykke Wallet App."
      );
    }
  }

  function usePhoto() {
    $(saveRelatedTarget)
      .closest($(".fileupload"))
      .removeClass("fileupload--fail")
      .addClass("fileupload--uploaded")
      .attr("style", "background-image: url(" + savePhotoSrc + ")");

    $(saveRelatedTarget)
      .closest(".fileupload")
      .children(".fileupload__field")
      .val(savePhotoSrc)
      .trigger("change");
    $(saveRelatedTarget)
      .closest(".fileupload")
      .children(".use-file")
      .val("false");
    $(saveRelatedTarget)
      .closest(".fileupload")
      .children(".use-camera")
      .val("true");
    $(saveRelatedTarget)
      .closest(".fileupload")
      .children(".file-extension")
      .val("png");

    hideUI();

    if (localStream) localStream.getVideoTracks()[0].stop();
    saveRelatedTarget = null;

    $("#submit-button").prop("disabled", false);
    $("#camera").modal("hide");
  }

  take_photo_btn.addEventListener("click", function(e) {
    e.preventDefault();
    takePhoto();
  });

  delete_photo_btn.addEventListener("click", function(e) {
    e.preventDefault();
    deletePhoto();
  });

  initCamera();

  if (camera_rotate_btn) {
    camera_rotate_btn.addEventListener('click', function (e) {
      e.preventDefault();

      var textContainer = $(this).find('._text'),
        newText = $(this).data('toggle-text'),
        cameraContainer = $(this).parents('.camera_stream');

      controls.classList.add("visible");
      frame.classList.remove("visible");
      take_photo_btn.classList.remove("visible");

      if (side === 'front') {
        side = 'back',
          textContainer.text(newText)
        cameraContainer.addClass('camera_stream--flipped');

        if (isFrontSnapExist && !isBackSnapExist) {
          controls.classList.remove("visible");
          frame.classList.add("visible");
          take_photo_btn.classList.add("visible");
        }
      }

      else {
        side = 'front'
        textContainer.text(initialText)
        cameraContainer.removeClass('camera_stream--flipped');

        if (!isFrontSnapExist && isBackSnapExist) {
          controls.classList.remove("visible");
          frame.classList.add("visible");
          take_photo_btn.classList.add("visible");
        }
      }

      if (!isFrontSnapExist && !isBackSnapExist && side === 'front') {
        controls.classList.remove("visible");
        frame.classList.add("visible");
        take_photo_btn.classList.add("visible");
        camera_rotate_btn.classList.remove("visible");
      }
    });
  }


  /*use_photo_btn.addEventListener("click", function(e) {
    e.preventDefault();
    usePhoto();

    if (action === "front") {
      setTimeout(function() {
        $('[data-action="back"][data-group=' + group + "]").click();
      }, 700);
    }
  });*/
}
