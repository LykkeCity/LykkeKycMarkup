import { UploadedFile } from "./common/UploadedFile.js"

export class ProofOfAddress
{
    constructor() {
        this.type = "ProofOfAddress";
        this.display = false;
        this.useCamera = false;
        this.useFile = false;
        this.hasFile = false;
        this.file = new UploadedFile();
    }

    toggleCamera() {
        this.useCamera = true;
        this.useFile = false;
        this.hasFile = false;
        this.file.reset();

        $(".x_use_file").val("false");
    }

    toggleFile() {
        this.useCamera = false;
        this.useFile = true;

        document.getElementsByClassName("x_file_upload")[0].click();
    }
}