function(properties, context) {
    
    let error_message = "";
    let error_occurred = false;
    let logo_data = "";
    let content_type = "";
    
    const axios = require("axios");
    
    function checkBubbleURL(url) {
        if(url.substring(0, 6) == "https:") return url;
        else return "https:" + url;
    }
    
    const url = checkBubbleURL(properties.logo_url);
    
    
    logo_data = context.async(async callback => {
        
        const response = await axios.get(url, { responseType: 'arraybuffer' }).catch(err => {
            error_message = JSON.stringify(err);
            error_occurred = true;
            callback(error_message, null);
        });
        
        const buffer64 = Buffer.from(response.data, 'binary').toString('base64');
        content_type = response.headers['content-type'];
        
        const uri = `data:${content_type};base64,${buffer64}`;
        
  		callback(null, uri);
        
    });
    
    
    
    return {
        "error_message": error_message,
        "error_occurred": error_occurred,
        "logo_data": logo_data,
        "content_type": content_type
    }
    
}