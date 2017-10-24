// function for call when run event call
function clickHandler(search) {     
    
    // Call the fetch function passing the url of the API as a parameter
    fetch('https://www.googleapis.com/books/v1/volumes?q='+search)
    .then((resp) => resp.json())
    .then(function(data) {
        console.log(data);
        var result = '<h3>Title of the books</h3>';
        result += data.items.map(function(item, index){ return '<p>'+(index+1)+'.  '+item.volumeInfo.title+'</p>'});
        console.log(result);
        document.getElementById('searchResult').innerHTML  = result;

    })
    .catch(function(error) {
        console.log(error);
    }); 
}


// Call function on window load
window.onload = function() {

    document.getElementById('search').onblur = function(){
        var search = document.getElementsByName("search")[0].value; //get search input
        if(search!=''){
                    
            document.getElementById('search').style.borderColor = "";
            document.getElementById('searchErrorMsg').style.display = "none";
        }else{

             document.getElementById('search').style.borderColor = "red";
             document.getElementById('searchErrorMsg').style.display = "block";
        }
    };

    

    //Start Working    
    document.getElementById("runButton").onclick = function() { 

        var search = document.getElementsByName("search")[0].value; //get search input        
        
        // Check validate input fields 
        if(search != ''){

            clickHandler(search);
        }else{

            document.getElementById('search').onblur();           
            return false;                  
        }
                                                   
    }

}