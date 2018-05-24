import { Id } from "../documents/Id.js";
import { ProofOfAddress } from "../documents/ProofOfAddress.js";
import { Selfie } from "../documents/Selfie.js";

export class SharedData
{
    constructor() {
        this.documents = [];
        this.kycStatus = "";
        this.goBackActive = false;

        this.documentId = new Id();
        this.documentAddress = new ProofOfAddress();
        this.documentSelfie = new Selfie();
    }
}

export let sharedData = new SharedData();