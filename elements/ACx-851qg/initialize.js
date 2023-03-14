function(instance, context) {
    
    function upload(uri, _filename) {
        
        // strip off the first part to the first comma "data:image/png;base64,iVBORw0K..."
        const stripped = uri.substring(uri.indexOf(',') + 1);
        
        // clean up the filename
        let filename = "qr-code.png";
        if (_filename) { filename = _filename.substring(_filename.length - 4) === ".png" ? _filename : _filename + ".png"; }
        
        context.uploadContent(filename, stripped, instance.data.uploadContentCallback);
    }
    instance.data.upload = upload;
    
    function uploadContentCallback(err, url) {
    	if (url) {
      		instance.publishState('url', url);
      		instance.triggerEvent('is_uploaded', function(err) { if (err) console.error(err) });
    	} 
        else {
      		console.error("An error occurred while uploading a QR Code: ", err);
    	}
  	}
  	instance.data.uploadContentCallback = uploadContentCallback;

}