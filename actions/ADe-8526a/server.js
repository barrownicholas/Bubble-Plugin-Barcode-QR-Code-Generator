function(properties, context) {
    
    let error_occurred = false;
    let error_message = "";
    let base_64 = "";
    let URL = "";
    
    
    
    
    function uploadBase64Server_Side(filename_, export_) {
        const uploaded_file_url = context.async(async callback => {
            try {

                const fileName = filename_.slice(-4) === ".png" ? filename_ : filename_ + ".png";
                
                let payload = {
                    name: fileName,
                    contents: export_,
                    private: false
                }

                var options = {
                    uri: properties.website_home_url + "fileupload",
                    method: "POST",
                    json: payload
                }

                var fileurl = context.request(options).body;

                callback(null, "https:" + fileurl);
            }
            catch (err) {
                error_occurred = true;
                error_message = "An error occurred while uploading the workbook file to the database: " + err;
            }
        });
        return uploaded_file_url;
    }
    
    
    
    
    
    
    var QRCode = require('qrcode');
    
    base_64 = context.async(async callback => {
        
        await QRCode.toDataURL(properties.data, function (err, url) {
            if(err) {
                error_occurred = true;
                error_message = JSON.stringify(err);
                callback(null, null);
            }
            else {
                callback(null, url);
            }
        });
        
    });
    
    
    if(properties.upload_to_file_manager) {
        
        // strip off the first part to the first comma "data:image/png;base64,iVBORw0K..."
        const stripped_base64 = base_64.substring(base_64.indexOf(',')+1);
        
        // upload the file
        URL = uploadBase64Server_Side(properties.filename, stripped_base64);
    }
    
    
    return {
        "base_64": base_64,
        "error_occurred": error_occurred,
        "error_message": error_message,
        "URL": URL
    }
}