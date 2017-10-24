Copy Paste Chrome Extension:
Extensions are small software programs that can modify and enhance the functionality of the Chrome browser. You write them using web technologies such as HTML, JavaScript, and CSS.
This extension mainly uses for the copy of the JSON data from the Clipboard and put the values into inputs fields. 

Installing in developer mode:
(1)   Extract given folder.
       - Go to Google setting
       - Extensions 
       - Active Developer mode
       - Load unpacked extension
       - Select given folder and Enabled the extension 

(2) From Web Storm
     - Install Google Web Store

Code Example:
manifest.js  Every app has a JSON-formatted manifest file, named manifest.JSON, that provides important information.

popup.js use for performing an action on "Fill Data" button And run a script of content.js 

content.js mainly work for getting copied data from clipboard and convert it into Object. Apply check on each element with object property. If matched then put the value from the object to input field of the HTML page which is provided by Client. 
