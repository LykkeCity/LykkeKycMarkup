function initCameraModule() {
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
      camera_container = document.querySelector(".camera_stream"),
      checkboxes = document.querySelector(".checkboxes_group");
    var localStream, savePhotoSrc, saveBackPhotoSrc, saveRelatedTarget, action, group, title;

    var side = 'front',
      isFrontSnapExist = false,
      isBackSnapExist = false,
      backSideEnabled = false;

    frame.classList.remove("hide");
    frame.classList.add("visible");

    if (checkboxes) var docId = $('input[name=doc]:checked').val();

    if (camera_rotate_btn) {
      backSideEnabled = true;
      initialText = camera_rotate_btn.innerText
    }

    if (docId === 'Passport') {
      backSideEnabled = false
    }
    else {
      backSideEnabled = true
    }

    navigator.getMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    Webcam.on('load', function () {
      showVideo();
    })
    Webcam.set({
      width: '100%',
      height: '100%',
      dest_width: 640,
      dest_height: 480,
      image_format: 'jpeg',
      jpeg_quality: 90,
      swfURL: '~/js/webcam/webcam.swf'
    });
    Webcam.attach(video);


    function takePhoto() {
      Webcam.snap( function(data_uri) {
        var snap = data_uri;
        console.log('takePhoto')
        // Show image.
        frame.classList.remove("visible");

        // Enable delete and save buttons
        controls.classList.add("visible");
        take_photo_btn.classList.remove("visible");
        camera_container.classList.add('camera_stream--snap');
        if (camera_rotate_btn && backSideEnabled) camera_rotate_btn.classList.add("visible");

        // Set the href attribute of the download button to the snap url.
        // Pause video playback of stream.

        console.log(side);

        if (side === 'front') {
          $(".x_photo_front_side").val("");
          $(".x_use_photo_front_side").val("true");

          var frontSnap = snap;

          isFrontSnapExist = true;
          image.setAttribute("style", "background-image: url("+ frontSnap +");");
          image.classList.add("visible");
          savePhotoSrc = frontSnap;

          $(".x_photo_front_side").val(frontSnap);

          var doctype = $(".x_document_typeid").val();

          if (doctype === "Passport" || doctype === "") {
            $(".document_submit").prop("disabled", false);
          }
          else {
            var backSide = $(".x_photo_back_side").val();
            var useBackSide = $(".x_use_photo_back_side").val();

            if (useBackSide === "true" && backSide !== "") {
              $(".document_submit").prop("disabled", false);
            }
            else {
              $(".document_submit").prop("disabled", true);
            }
          }

        } else {
          $(".x_photo_back_side").val("");
          $(".x_use_photo_back_side").val("true");

          var backSnap = snap;

          imageBack.setAttribute("style", "background-image: url("+ backSnap +");");
          imageBack.classList.add("visible");
          isBackSnapExist = true;
          saveBackPhotoSrc = backSnap;

          $(".x_photo_back_side").val(backSnap);

          var frontSide = $(".x_photo_front_side").val();
          var useFrontSide = $(".x_use_photo_front_side").val();

          if (useFrontSide === "true" && frontSide !== "") {
            $(".document_submit").prop("disabled", false);
          }
        }

        if (isFrontSnapExist && isBackSnapExist) {
          video.classList.remove("visible");
          Webcam.freeze();
        }
      } );
    }

    function showVideo() {
      Webcam.unfreeze();

      controls.classList.remove("visible");
      frame.classList.add("visible");
      take_photo_btn.classList.add("visible");
      video.classList.add("visible");
      error_message.classList.remove("visible");
    }

    function setSnapshotSize() {
      // Here we're using a trick that involves a hidden canvas element.

      var hidden_canvas = document.querySelector("canvas");

      var width = video.videoWidth,
        height = video.videoHeight;

      if (width && height) {
        // Setup a canvas with the same dimensions as the video.
        hidden_canvas.width = width;
        hidden_canvas.height = height;
      }
    }

    function deletePhoto() {
      showVideo()
      toggleUIOnDelete()

      $(".document_submit").prop("disabled", true);

      if (side === 'front') {
        $(".x_photo_front_side").val("");
        $(".x_use_photo_front_side").val("false");

        image.setAttribute("style", "");
        image.classList.remove("visible");
        isFrontSnapExist = false;
      } else {
        $(".x_photo_back_side").val("");
        $(".x_use_photo_back_side").val("false");

        imageBack.setAttribute("style", "");
        imageBack.classList.remove("visible");
        isBackSnapExist = false;
        if (camera_rotate_btn && backSideEnabled) camera_rotate_btn.classList.add("visible");
      }

      if (!isFrontSnapExist && !isBackSnapExist) {
        camera_container.classList.remove('camera_stream--snap');
      }
    }

    function toggleUIOnDelete() {
      video.classList.add("visible");

      if (isBackSnapExist && isFrontSnapExist) {
        take_photo_btn.classList.add("visible");
        controls.classList.remove("visible");
        if (camera_rotate_btn && backSideEnabled) camera_rotate_btn.classList.add("visible");
      }
      else {
        controls.classList.remove("visible");
        frame.classList.add("visible");
        take_photo_btn.classList.add("visible");
        if (camera_rotate_btn && backSideEnabled) camera_rotate_btn.classList.remove("visible");
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
      image.setAttribute("style", "");
      image.classList.remove("visible");
    }

    function clearAll() {
      showVideo();

      $("._rotate_side ._text").text('Back side');

      isFrontSnapExist = false;
      isBackSnapExist = false;
      side = 'front';

      image.setAttribute("style", "");
      imageBack.setAttribute("style", "");
      image.classList.remove("visible");
      imageBack.classList.remove("visible");
      controls.classList.remove("visible");
      frame.classList.add("visible");
      take_photo_btn.classList.add("visible");
      camera_container.classList.remove('camera_stream--snap', 'camera_stream--flipped');
      if (camera_rotate_btn) camera_rotate_btn.classList.remove("visible");

      $(".x_photo_front_side").val("");
      $(".x_use_photo_front_side").val("false");

      $(".x_photo_back_side").val("");
      $(".x_use_photo_back_side").val("false");

      $(".document_submit").prop("disabled", true);
    }

    if (camera_rotate_btn) {
      $('._rotate_side').off('click');
      $('._rotate_side').on('click', function (e) {
        e.preventDefault();

        var textContainer = $(this).find('._text'),
          newText = $(this).data('toggle-text'),
          cameraContainer = $(this).parents('.camera_stream');

        controls.classList.add("visible");
        frame.classList.remove("visible");
        take_photo_btn.classList.remove("visible");

        if (side === 'front') {
          side = 'back';
          textContainer.text(newText);
          cameraContainer.addClass('camera_stream--flipped');

          if (isFrontSnapExist && !isBackSnapExist) {
            controls.classList.remove("visible");
            frame.classList.add("visible");
            take_photo_btn.classList.add("visible");
          }
        }
        else {
          side = 'front';
          textContainer.text(initialText);
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

    $('._take_photo').off('click');
    $('._take_photo').on("click", function (e) {
      e.preventDefault();
      takePhoto();
    });

    $('._delete_photo').off('click');
    $('._delete_photo').on("click", function (e) {
      e.preventDefault();
      deletePhoto();
    });

    $('input[name=doc]').off('change');
    $('input[name=doc]').on('change', function (e) {
      e.preventDefault();

      docId = $(this).val();

      if (docId === 'Passport')
      {
        backSideEnabled = false;
        clearAll();
      }

      if (docId === 'IdCard')
      {
        backSideEnabled = true
        clearAll();
      }

      if (docId === 'DrivingLicense')
      {
        backSideEnabled = true
        clearAll();
      }
    });
  }
}

initCameraModule()