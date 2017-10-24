var counter=0;
var myTimeInterval;
var stop = false;

  /**
    * @name: onClickCheckbox
    * @description: checked all checkbox according to user input 
    * return (*)
    **/
function onClickCheckbox(){
     
    if(timeCount <= 36000 && profile >= counter){
        var delayMillis = 2000; //4 second       
        var checkboxes = document.querySelectorAll(".fa-square");
        
        // checkboxes are exist or not     
        if(checkboxes.length === 0) {  

            stop = true;            
        }else { 

            //fire click event on Select checkbox button
            for(var i=0; i < checkboxes.length; i++) { 
               
                if(typeof document.getElementsByClassName("ehunter_checkbox_container")[i] !== 'undefined') {
                    
                    //stop = false; 
                    if(profile <= counter){
                       
                        stop = true;
                        clearInterval(myTimeInterval);
                        alert("Number of profiles have finished");
                        return true;
                    }  

                    console.log(document.getElementsByClassName("ehunter_checkbox_container")[i]);
                    document.getElementsByClassName("ehunter_checkbox_container")[i].click(); 
                    ++counter;                
                }                                        
            }

            document.getElementsByClassName("orange-btn")[0].click(); 
            console.log(document.getElementsByClassName("orange-btn")[0].disabled);

            //set time of one second for display checked checkboxes and redirect to next page
            setTimeout(function() {

                if(document.getElementsByClassName("orange-btn")[0].disabled === true)
                {
                    setTimeout(function() {
                        document.getElementsByClassName("ehunter_search_popup_close")[0].click()
                    }, 4000);
                    console.log("Close hunter");
                }

                //find the next button of the pagination and click event fire on.
                if(typeof document.getElementsByClassName("next-text")[0] != 'undefined' ){

                    document.getElementsByClassName("next-text")[0].click();
                }else{  

                    //Stop auto excecution of the extension on last page                     
                    clearInterval(myTimeInterval);
                    alert("This is the last page.");                      
                }
            }, delayMillis);                    
        }
    }else{       
                 
        clearInterval(myTimeInterval);        
        alert("Extension execution finished.");
    }
}

//10 hour in milisecond 36000000
if(counter === 0 && timeCount <= 36000){
   
    myTimeInterval = setInterval(function(){

        //Increment timeinterval as per the input
        timeCount += avgTimeInterval;                                                                          
        onClickCheckbox()}, avgTimeInterval); 
}else{

    clearInterval(myTimeInterval);
    alert("Given execution hours have finished.");    
}

if(stop){       
    
    clearInterval(myTimeInterval);
    alert("Execution has been stopped.");
}
