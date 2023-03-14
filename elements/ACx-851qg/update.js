function(instance, properties, context) {
    
    // resize event
    if(instance.data.qrcode) {
        
        // the main HTML element on the page
        let container = instance.canvas.get(0); 
    
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        
        instance.data.qrcode.resize(width, height); // Resize the image 
    }
}