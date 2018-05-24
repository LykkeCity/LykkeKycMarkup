import { DocumentsAPI } from "./api/DocumentsAPI.js";
import { sharedData } from "./data/SharedData.js";

var _this = "";

var app = new Vue({
  el: "#webkycflow-vue-app",
  data: sharedData,
  methods: {
    convertBytes: function (x) {
      let units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      let l = 0, n = parseInt(x, 10) || 0;

      while (n >= 1024 && ++l)
        n = n / 1024;

      return (n.toFixed(n >= 10 || l < 1 ? 0 : 1) + ' ' + units[l]);
    },
    onSubmitId: function () {
      console.log(_this.documents.TypeId);

      $("#document_submit_id").prop("disabled", true);
      let frontSideResult = false, backSideResult = false;

      let docFrontSide = {
        DocumentName: _this.documents.TypeId,
        DocumentType: "",
        FileExtension: "png",
        Data: $(".x_photo_front_side").val()
      };

      let docBackSide = {
        DocumentName: _this.documents.TypeId,
        DocumentType: "BackSide",
        FileExtension: "png",
        Data: $(".x_photo_back_side").val()
      };

      frontSideResult = DocumentsAPI.uploadDocument(docFrontSide);

      if (_this.documents.TypeId != "Passport") {
        backSideResult = DocumentsAPI.uploadDocument(docBackSide);
      }
      else {
        backSideResult = true;
      }

      _this.documents = DocumentsAPI.getDocuments();
      _this.kycStatus = DocumentsAPI.getKycStatus();

      if (!_this.documents.HasDeclinedDocuments) {
        _this.goBackActive = false;
      }

      if (frontSideResult && backSideResult) {
        _this.documentId.display = false;

        if (_this.documents.RequireAddress) {
          _this.documentAddress.display = true;
        }
        else if (_this.documents.RequireSelfie) {
          _this.documentSelfie.display = true;
        }
        else {

        }

        if (_this.documents.IsCompleted) {
          console.log("Submit Id");

          _this.kycStatus = "Pending";
          DocumentsAPI.submitDocuments();
        }
      }
      else {
        $("#document_submit_id").prop("disabled", false);
      }

      $(".x_photo_front_side").val("");
      $(".x_photo_back_side").val("");
      $(".x_use_file").val("");

      _this.documents.TypeId = "";
    },
    onSubmitAddress: function () {
      _this.documents.TypeId = "";
      $("#document_submit_address").prop("disabled", true);
      let frontSideResult = false;

      let docFrontSide = {};
      docFrontSide.DocumentName = "ProofOfAddress";
      docFrontSide.DocumentType = "";

      if (_this.documentAddress.hasFile) {
        docFrontSide.FileExtension = _this.documentAddress.file.extension;
      }
      else {
        docFrontSide.FileExtension = "png";
      }

      docFrontSide.Data = $(".x_photo_front_side").val();
      frontSideResult = DocumentsAPI.uploadDocument(docFrontSide);

      _this.documents = DocumentsAPI.getDocuments();
      _this.kycStatus = DocumentsAPI.getKycStatus();

      if (!_this.documents.HasDeclinedDocuments) {
        _this.goBackActive = false;
      }

      if (frontSideResult) {
        _this.documentAddress.display = false;

        if (_this.documents.RequireSelfie) {
          _this.documentSelfie.display = true;
        }

        if (_this.documents.IsCompleted) {
          console.log("Submit Address");

          _this.kycStatus = "Pending";
          DocumentsAPI.submitDocuments();
        }
      }
      else {
        $("#document_submit_address").prop("disabled", false);
      }
    },
    onSubmitSelfie: function () {
      _this.documents.TypeId = "";
      $("#document_submit_selfie").prop("disabled", true);
      let frontSideResult = false, submitResult = false;

      let docFrontSide = {
        DocumentName: "Selfie",
        DocumentType: "",
        FileExtension: "png",
        Data: $(".x_photo_front_side").val()
      };

      frontSideResult = DocumentsAPI.uploadDocument(docFrontSide);

      _this.documents = DocumentsAPI.getDocuments();
      _this.kycStatus = DocumentsAPI.getKycStatus();

      if (!_this.documents.HasDeclinedDocuments) {
        _this.goBackActive = false;
      }

      if (frontSideResult) {
        $("#document_submit_selfie").prop("disabled", true);
        _this.documentSelfie.display = false;

        if (_this.documents.IsCompleted) {
          console.log("Submit Selfie");

          _this.kycStatus = "Pending";
          DocumentsAPI.submitDocuments();
        }
      }
      else {
        $("#document_submit_selfie").prop("disabled", false);
      }
    },
    onGoBack: function () {
      _this.goBackActive = true;
    },

    validateFile: function (event, fileInfo) {
      var file = event.target.files[0];

      if (file.size > 3145728) {
        file.value = "";
        fileInfo.reset();

        $(".document_submit").prop("disabled", true);

        $(".x_use_file").val("false");
        this.documentAddress.hasFile = false;

        alert('The maximum file size is 3MB');
        return false;
      }

      var fileName = file.name;
      var idxDot = fileName.lastIndexOf(".") + 1;
      var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();

      if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "pdf") {
        this.documentAddress.hasFile = true;
        $(".document_submit").prop("disabled", false);

        fileInfo.name = file.name;
        fileInfo.extension = extFile;
        fileInfo.size = this.convertBytes(file.size);

        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          $(".x_photo_front_side").val(reader.result);
        };

        $(".x_use_file").val("true");
      }
      else {
        file.value = "";
        fileInfo.reset();

        $(".document_submit").prop("disabled", true);

        $(".x_use_file").val("false");
        this.documentAddress.hasFile = false;

        alert("Only jpg, jpeg, png and pdf files are allowed!");
        return false;
      }
    }
  },
  mounted: function () {
    _this = this;

    _this.kycStatus = DocumentsAPI.getKycStatus();
    _this.documents = DocumentsAPI.getDocuments();

    console.log(_this.kycStatus);
    console.log(_this.documents);

   // if (_this.documents == "") location = "/404";

    if (new Boolean(_this.documents.RequireId) == true) {
      _this.documentId.display = true;
    }
    else if (new Boolean(_this.documents.RequireAddress) == true) {
      _this.documentAddress.display = true;
    }
    else if (new Boolean(_this.documents.RequireSelfie) == true) {
      _this.documentSelfie.display = true;
    }
  },
  updated: function () {
    initCameraModule();
  },
  created: function () {
    initCameraModule()
  }
});