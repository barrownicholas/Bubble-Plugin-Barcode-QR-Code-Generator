function(properties, context) {
    
    let error_occurred = false;
    let error_message = "";
    let base_64 = "";
    let URL = "";


    var JsBarcode = require('jsbarcode');
    const svg64 = require('svg64');
    const {DOMImplementation, XMLSerializer} = require('xmldom');
    const xmlSerializer = new XMLSerializer();
    const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
    const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    // do everything below this line
    
    
    
    function uploadBase64Server_Side(filename_, export_) {
        const uploaded_file_url = context.async(async callback => {
            try {

                const fileName = filename_.slice(-4) === ".svg" ? filename_ : filename_ + ".svg";

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
    

    // validate the data
    let data = properties.data;

    try {
        JsBarcode(svgNode, data, {
            xmlDocument: document,
            format: properties.format,
            width: properties.width,
            height: properties.height,
            displayValue: properties.displayValue,
            text: properties.text ? properties.text : properties.data,
            textAlign: properties.textAlign,
            textPosition: properties.textPosition,
            textMargin: properties.textMargin,
            fontSize: properties.fontSize,
            background: properties.background,
            lineColor: properties.lineColor,
            margin: properties.margin
        });
    }
    catch (err) {
        error_occurred = true;
        error_message = err;
    }

    const svgText = xmlSerializer.serializeToString(svgNode);
    const base64data = svg64(svgText);

    base_64 = base64data;
    
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