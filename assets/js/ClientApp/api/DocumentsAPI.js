export class DocumentsAPI
{
    static getKycStatus() {
        let result = "";

        $.ajax({
          // url: '/api/documents/kycstatus', method: 'GET', type: 'json', async: false,
            success: function (data) {
                result = data;
            }
        });

        return result;
    }

    static getDocuments() {
        let result = "";

        $.ajax({
            // url: '/api/documents/list', method: 'GET', type: 'json', async: false,
            success: function (data) {
                result = data;
            }
        });

        return result;
    }

    static uploadDocument(docModel) {
        var result = false;

        $.ajax({
          // url: '/api/documents/upload', method: 'POST', data: docModel, type: 'json', async: false,
            success: function () {
                result = true;
            }
        });

        return result;
    }

    static submitDocuments() {
        $.ajax({
          // url: '/api/documents/submit', method: 'POST', type: 'json', async: true
        });
    }
}