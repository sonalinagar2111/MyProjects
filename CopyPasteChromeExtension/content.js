/**
   * @name getClipbaord
   * @desc Copy JSON from Clipboard 
   * @returns {*}
   */
document.body.addEventListener("paste", function(e) {
	let getJsonRecord = '';
       
    // get text representation of clipboard
    var text = '';
    text = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain')
  
    try {
      getJsonRecord = JSON.parse(text);
      var x = document.getElementsByTagName("input");  		
	
  		//Loop for check if all input elements name and JSON onject key name are equal 
  		//Then fill value into input    
      if(typeof x != 'undefined'){

        for(var i = 0; i < x.length; i++){
          
          if(typeof getJsonRecord[x[i].name] !== 'undefined' 
            && getJsonRecord[x[i].name] !== '' 
            && document.getElementsByName(x[i].name).length > 0){
            document.getElementsByName(x[i].name)[0].value = getJsonRecord[x[i].name];           
          }
        }
      }	
       
    } catch (e) {    	
    	//document.execCommand("paste", false, text);        
    }    
    return true;
});

