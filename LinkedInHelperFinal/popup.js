// function for call when run event call
function clickHandler(profiles, minTimeIntervalSecond, maxTimeIntervalSecond, avgTimeIntervalMiliSecond) {	
    
    var maxTimeIntervalSecondMiliSecond = maxTimeIntervalSecond * 1000;
    console.log(avgTimeIntervalMiliSecond);
    var param = "var stop=false, profile = "+profiles+", avgTimeInterval = "+avgTimeIntervalMiliSecond+", maxTimeInterval = "+maxTimeIntervalSecondMiliSecond+", timeCount=0";    

    //execute content script
    chrome.tabs.executeScript({
        code: param
    }, function(result) {           	  	
        chrome.tabs.executeScript({file: "script.js"}, function(result) {
        });
    });
}

// function for call when stop event call
function stopHandler() { 

    chrome.tabs.executeScript({
        code: "var stop=true, timeCount=0"        
    }, function(result) {           
        chrome.tabs.executeScript({file: "script.js"}, function(result) {
        });
    });
}

// Call function on window load
window.onload = function() {

	document.getElementById('profiles').onblur = function(){
		var profiles = document.getElementsByName("profiles")[0].value; //Number of profiles 
		if(profiles!='' && (profiles >= 1 && profiles <= 100000)){
                    
            document.getElementById('profiles').style.borderColor = "";
            document.getElementById('profileMsg').style.display = "none";
        }else{

        	 document.getElementById('profiles').style.borderColor = "red";
        	 document.getElementById('profileMsg').style.display = "block";
        }
	};

	document.getElementById('minTimeInterval').onblur = function(){
		 var minTimeIntervalSecond = document.getElementsByName("minTimeInterval")[0].value; // Number of seconds for action
		 if(minTimeIntervalSecond!='' && (minTimeIntervalSecond >= 1 && minTimeIntervalSecond <= 36000)){
                    
            document.getElementById('minTimeInterval').style.borderColor = "";
            document.getElementById('minTimeIntervalMsg').style.display = "none";
        }else{

        	document.getElementById('minTimeInterval').style.borderColor = "red";
        	document.getElementById('minTimeIntervalMsg').style.display = "block";
        }
	};

	document.getElementById('maxTimeInterval').onblur = function(){
	   var maxTimeInterval = document.getElementsByName("maxTimeInterval")[0].value; // Number of hour for execution time
	   if(maxTimeInterval!='' && (maxTimeInterval >= 1 && maxTimeInterval <= 36000)){
                
            document.getElementById('maxTimeInterval').style.borderColor = "";
            document.getElementById('maxTimeIntervalMsg').style.display = "none";
        }else{

        	document.getElementById('maxTimeInterval').style.borderColor = "red";
        	document.getElementById('maxTimeIntervalMsg').style.display = "block";
        }
	};

    //Start Working    
    document.getElementById("runButton").onclick = function() { 

        var profiles = document.getElementsByName("profiles")[0].value; //Number of profiles 
        var minTimeIntervalSecond = document.getElementsByName("minTimeInterval")[0].value; // Number of seconds for action
        var maxTimeIntervalSecond = document.getElementsByName("maxTimeInterval")[0].value; 
        var avgTimeIntervalSecond = (parseInt(minTimeIntervalSecond) + parseInt(maxTimeIntervalSecond))/2;
        var avgTimeIntervalMiliSecond = avgTimeIntervalSecond * 1000;
        console.log(avgTimeIntervalSecond, avgTimeIntervalMiliSecond);
        document.getElementById('avgTimeIntervalMsg').style.display = "none";
        document.getElementById('timeIntervalMsg').style.display = "none";
        
        // Check validate input fields 
        if(profiles >= 1 && profiles <= 100000 
            && minTimeIntervalSecond >= 1 && minTimeIntervalSecond <= 36000 
            && maxTimeIntervalSecond >= 1 && maxTimeIntervalSecond <= 720 
            && minTimeIntervalSecond < maxTimeIntervalSecond
            && avgTimeIntervalSecond >= 4){

            clickHandler(profiles, minTimeIntervalSecond, maxTimeIntervalSecond, avgTimeIntervalMiliSecond);
        }else{

            document.getElementById('profiles').onblur();
            document.getElementById('minTimeInterval').onblur();
            document.getElementById('maxTimeInterval').onblur();

            if(avgTimeIntervalSecond < 4){
                document.getElementById('avgTimeIntervalMsg').style.display = "block";
            }
            if(minTimeIntervalSecond > maxTimeIntervalSecond){
                document.getElementById('timeIntervalMsg').style.display = "block";
            }               
            return false;                  
        }
                                                   
    }

    //Stop working
    document.getElementById("stopButton").onclick = function() {  stopHandler(); }
}