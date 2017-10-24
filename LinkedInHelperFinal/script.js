var counter=0;
var myTimeInterval;
//var stop = false;
timeInterval = 0;

/**
    * @name: hunterAction
    * @description: hunter popup close to explicitly 
    * return (*)
**/
function hunterAction(){
    if(typeof document.getElementsByClassName("orange-btn")[0] != 'undefined'){
        document.getElementsByClassName("orange-btn")[0].click(); 
       // console.log(document.getElementsByClassName("orange-btn")[0].disabled);

        //set time of one second for display checked checkboxes and redirect to next page
        if(document.getElementsByClassName("orange-btn")[0].disabled === true)
        {
            setTimeout(function() {
                if(document.getElementById("ehunter_search_popup_close")){
                    document.getElementById("ehunter_search_popup_close").click();
                }            
            }, (timeInterval-1));
            //console.log("Close hunter");
        }
    }
    
}                

/**
    * @name: onClickCheckbox
    * @description: checked all checkbox according to user input 
    * return (*)
**/
function onClickCheckbox(){
     
    console.log(timeCount, profile, counter);

    if(timeCount <= 36000 && profile >= counter){
        var delayMillis = 2000; //4 second       
        var checkboxes = document.querySelectorAll(".fa-square");
        
        // checkboxes are exist or not     
        if(checkboxes.length === 0) {  

            
            //find the next button of the pagination and click event fire on.
            if(typeof document.getElementsByClassName("next-text")[0] != 'undefined' ){

                document.getElementsByClassName("next-text")[0].click();
            }else{  

                //Stop auto excecution of the extension on last page 
                stop = true; 
                alert("This is the last page."); 
                return true;                     
            }         
        }else { 

            //fire click event on Select checkbox button
            for(var i=0; i < checkboxes.length; i++) { 
               
                if(typeof document.getElementsByClassName("ehunter_checkbox_container")[i] !== 'undefined') {
                     
                    if(profile <= counter){
                       
                        stop = true;                        
                        hunterAction();
                        alert("Number of profiles have finished");
                       
                        return true;
                    }  

                    //console.log(document.getElementsByClassName("ehunter_checkbox_container")[i]);
                    document.getElementsByClassName("ehunter_checkbox_container")[i].click(); 
                    ++counter;                
                }                                        
            }

            //call hunter
            hunterAction();

            //find the next button of the pagination and click event fire on.
            if(typeof document.getElementsByClassName("next-text")[0] != 'undefined' ){

                document.getElementsByClassName("next-text")[0].click();
            }else{  

                //Stop auto excecution of the extension on last page                     
                stop = true;
                alert("This is the last page."); 
                return true;                     
            }

        }
        if(!stop){      
            console.log("into fun call");
            timeInterval = Math.floor(Math.random() * maxTimeInterval) + avgTimeInterval;
            //console.log(timeInterval);
                setTimeout(function() {
                    //Increment timeinterval as per the input
                    timeCount += timeInterval;                                                                          
                    onClickCheckbox()}, timeInterval); 
            }  
    }else{       
         
        stop = true;      
        alert("Extension execution finished.");
        return true;
    }
}

//10 hour in milisecond 36000000
//console.log(stop);
if(counter === 0 && timeCount <= 36000 && stop == false){
   onClickCheckbox();
   
}else{
   
    stop = true;
    alert("Execution has been stopped."); 

}