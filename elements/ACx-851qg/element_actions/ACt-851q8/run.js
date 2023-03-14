function(instance, properties, context) {
	
    // the main HTML element on the page
    let container = instance.canvas.get(0); 
    
    if(properties.override_size) {
        container = document.createElement("CANVAS");
    }
    
    instance.data.onRenderingEnd = function(qrCodeOptions, dataURI) {
        
        instance.publishState('base64_uri', dataURI);

        instance.triggerEvent('is_generated', function(err) { if (err) console.error(err) });

        if(properties.upload_to_file_manager) {

            instance.data.upload(dataURI, properties.filename);

        }
    }
    
    let width = container.offsetWidth;
    let height = container.offsetHeight;
    
    if(properties.override_size) {
        width = properties.size;
        height = properties.size;
    }
    
    var options = {
        
        text: properties.data,
        
        width: width,
        height: height,
        
        colorDark : properties.qr_code_foreground,
        colorLight : properties.qr_code_background,
        
        correctLevel : QRCode.CorrectLevel.H,
        
        logo: properties.logo_uri,
        logoWidth: Math.floor(width / 10 * 4),
        logoHeight: Math.floor(height / 10 * 4),
        logoBackgroundColor: properties.logo_background_color,
        
        onRenderingEnd: instance.data.onRenderingEnd
	};
    
    instance.data.qrcode = new QRCode(container, options);
}