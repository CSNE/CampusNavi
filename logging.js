//Very simple logging framework.
//Well maybe not that simple


/*
  A Logging framework for HTML/JS apps.

  Firstly, call Log.init() with a DOM element as its argument.
  All the logs will be displayed within the supplied element.

  if Log.init() is called with no arguments,
  a togglable overlay element will be created automatically.

  You can then call one of the five methods:
  Log.verbose() - For not-so-important messages. Displayed in gray.
  Log.debug()   - For information that may be useful when debugging. Displayed in black.
  Log.info()    - For informative messages. Displayed in green.
  Log.warning() - For non-critical errors. Displayed in orange.
  Log.error()   - For critical errors. Displayed in red.
*/

var Log = (function () {

    var display=null;

    var buttonsList=[];

    var currentVisibilityOptions = [];

    var levelToName=["","Verbose","Debug","Info","Warning","Error"];
    var levelToCharacter = ["", "V", "D", "I", "W", "E"];

    var levelElements = [[], [], [], [], [], []];
  
    var maxLogEntries=1000;

    function init(container){

        if (display!=null) throw "Cannot initialize twice!";


        if (!container){
            //setup container
            var logContainer=document.createElement("div");        
            document.body.appendChild(logContainer);
            logContainer.classList.add("loggingContainer");
            logContainer.style.display="none";


            //setup show/hide buttons
            var showHideButton=document.createElement("div");        
            document.body.appendChild(showHideButton);
            showHideButton.classList.add("logShowAndHideButton");
            showHideButton.innerHTML="Show Logs"
            showHideButton.addEventListener("click",function(){
                if (logContainer.style.display==="flex") {
                    logContainer.style.display="none";
                    showHideButton.innerHTML="Show Logs";
                }else{
                    logContainer.style.display="flex";
                    showHideButton.innerHTML="Hide Logs";
                }

            });

            //styles
            var css = logContainer.ownerDocument.createElement("style");
            css.type = "text/css";
            var cssText="";
            cssText+= ".loggingContainer{height:100%;width:100%;position:fixed;z-index:1000;left:0;top:0;background-color: white;opacity:0.8;}\n";
            cssText+= ".logShowAndHideButton{position:fixed;z-index:1001;left:0;bottom:0;background-color: #A0A0A0;opacity:0.8;}\n";
            cssText+= ".logShowAndHideButton{font-size:24pt;color:black;padding:8px;}\n";
            css.innerHTML=cssText;
            logContainer.ownerDocument.head.appendChild(css);
        }else{
            var logContainer=container;
            logContainer.classList.add("loggingContainer");
        }


        //setup buttons container
        var buttonsContainer=logContainer.ownerDocument.createElement("div");
        buttonsContainer.classList.add("loggingControls");
        logContainer.appendChild(buttonsContainer);

        //create buttons
        for(var i = 1; i <= 5; i++){
            var label = logContainer.ownerDocument.createElement("label");

            var btn = logContainer.ownerDocument.createElement("input");
            btn.type="checkbox";
            //if (i>1) buttonsList[i].checked=true;
            btn.checked=true;
            btn.addEventListener("change", getVisibilityFromButtonsAndSetVisibility);
            buttonsList[i] = btn;
            label.appendChild(btn);

            var span = logContainer.ownerDocument.createElement("span");
            span.innerHTML = levelToName[i];
            label.appendChild(span);

            buttonsContainer.appendChild(label);

        }

        //serup log container
        display=logContainer.ownerDocument.createElement("p");
        display.classList.add("loggingDisplay");
        logContainer.appendChild(display);

        //styles
        var css = logContainer.ownerDocument.createElement("style");
        css.type = "text/css";
        var cssText="";
        cssText+= ".loggingContainer {display:flex;flex-flow: column;}\n";
        cssText+= ".loggingContainer *{text-align:left;line-height:1.2;}\n";
        cssText+= ".loggingDisplay .level1 {color:gray;}\n";
        cssText+= ".loggingDisplay .level2 {color:black;}\n";
        cssText+= ".loggingDisplay .level3 {color:green;}\n";
        cssText+= ".loggingDisplay .level4 {color:orange;}\n";
        cssText+= ".loggingDisplay .level5 {color:red;}\n";
        cssText+= ".loggingDisplay .stacktrace {font-size:0.7em;}\n";
        cssText+= ".loggingDisplay {overflow:scroll;}\n";
        cssText+= ".loggingDisplay {font-family:consolas, monospace;}\n";
        //cssText+= ".loggingDisplay {display: flex;flex-flow: column;  height: 100%;}\n";
        cssText+= ".loggingDisplay {flex-grow:1;}\n";
        cssText+= ".loggingControls {padding:4px;}\n";
        cssText+= ".loggingControls * {margin:4px;}\n";
        css.innerHTML=cssText;
        logContainer.ownerDocument.head.appendChild(css);

        getVisibilityFromButtonsAndSetVisibility();

    }

    function timestamp(){
        var d=new Date();

        var m=""+d.getMinutes();
        var s=""+d.getSeconds();
        var ms=""+d.getMilliseconds();

        while (m.length<2) m="0"+m;
        while (s.length<2) s="0"+s;
        while (ms.length<3) ms="0"+ms;

        return ""+m+":"+s+"."+ms;
    }

    function prependChild(elem){
        if (display!=null){
            display.insertBefore(elem,display.firstChild);
        }else{
            throw "No display element! Make sure init() was called."
        }
        
        while (maxLogEntries!==0 && display.children.length>maxLogEntries){
            display.removeChild(display.lastChild);
        }
    }

    function getCallLocationAtDepth(depth){
        //stack trace
        var stacktrace = (new Error()).stack;
        //alert(stacktrace);
        if (!stacktrace)//internet explorer doesn't support Error.stack
            return "";
        var stacks = stacktrace.split("\n");

        //The weird code below
        //is due to how different browsers return a differently formatted Error.stack
        //var stackdepth=0;
        var callLocation = '';

        callLocation = stacks[depth + (stacks[0].trim() == "Error")];

        /*
        while (stackdepth<(depth+1)){ //+1 because of this function
            callLocation=stacks.shift().trim();

            //Chrome-based browsers
            //will have "Error" as the first line of the stack trace
            //which does not count as a call location
            //Firefox does not have this first line
            //and begins the stack trace right away
            //thus this conditional.
            if (callLocation!=="Error") stackdepth++; 
        }
        //*/

        //get only the last file
        var callLocationFormatted=callLocation.split("/").pop();

        //the below regex will convert
        // index.html:123:45) --> index.html:123
        callLocationFormatted=/.*?:[^:]*/.exec(callLocationFormatted)[0];

        return callLocationFormatted;

    }

    function print(level,message){
        if (display!=null){



            var elem=display.ownerDocument.createElement("div");
            elem.classList.add("level" + level);

            //level & time
            var levelChar=levelToCharacter[level];


            var callLocation=getCallLocationAtDepth(3);
            //if there's no filename, prepend index.html
            if (callLocation.charAt(0)==":") callLocation="index.html"+callLocation;

            //alert(lastExternalCallLocation);
            var information="["+levelChar+"|"+timestamp()+"|"+callLocation+"] ";
            elem.innerHTML+=information;

            // newlines are converted to <br>
            var messageSplit=message.split("\n");
            for(var i=0;i<messageSplit.length;i++){
                if (i!=0) {
                    elem.innerHTML+="<br>";
                    elem.innerHTML+="&nbsp".repeat(information.length);
                }
                elem.innerHTML+=messageSplit[i]
            }



            //if current level is disabled, hide it.
            elem.style.display =
                currentVisibilityOptions[level] ?
                "block" : "none";


            //elem.appendChild(display.ownerDocument.createElement("br"));

            prependChild(elem);
            levelElements[level].push(elem);
        }else{
            throw "No display element! Make sure init() is called with proper HTML element."
        }

    }
    function printStackTrace(error){
        if (display!=null){
            var message=error.stack;



            var elem=display.ownerDocument.createElement("div");
            elem.classList.add("level5");
            elem.classList.add("stacktrace");

            if (!message){ //For browsers not supporting Error.stack
                elem.innerHTML="This browser does not support Error stack traces.";
            }else{
                // newlines are converted to <br>
                var messageSplit=message.split("\n");
                elem.innerHTML+="------Stack Trace------<br>";
                for(var i=0;i<messageSplit.length;i++){
                    if (i!=0) {
                        elem.innerHTML+="<br>";
                    }
                    elem.innerHTML+=messageSplit[i]
                }
                elem.innerHTML+="<br>-----------------------";
            }
            elem.style.display =
                    currentVisibilityOptions[5] ?
                    "block" : "none";
            prependChild(elem);
            levelElements[5].push(elem);
        }else{
            throw "No display element! Make sure init() is called with proper HTML element."
        }
    }
    function verbose(message){
        print(1,message);
    }
    function debug(message){
        print(2,message);
    }
    function info(message){
        print(3,message);
    }
    function warning(message){
        print(4,message);
    }
    function error(message){
        printStackTrace(new Error());
        print(5,message);
    }

    function getVisibilityFromButtonsAndSetVisibility(){
        //res={};
        for (var i=1;i<=5;i++){
            var b = buttonsList[i].checked;
            if (currentVisibilityOptions[i] ^ b)
            {
                currentVisibilityOptions[i] = b;
                setVisibility(i, b);
            }
        }
        //currentVisibilityOptions=res;

        //setVisibility(currentVisibilityOptions);
    }

    /*
    function setVisibility(options) {
        //alert(JSON.stringify(options));
        if (display!=null){
            var children = display.childNodes;
            //alert([children, children.length]);
            for (var i = 0; i < children.length; i++) {
                //alert(children[i].classList[0]);
                //alert(children[i].classList)
                if (children[i].classList.length > 0) {
                    if (options[children[i].classList[0]]) children[i].style.display="inline";
                    else children[i].style.display="none";
                }

            }
        }else{
            throw "No display element! Make sure init() is called with proper HTML element."
        }

    }
    //*/

    function setVisibility(level, b)
    {
        var d = b ? "block" : "none";
        var a = levelElements[level];
        for (var i = 0; i < a.length; i++)
        {
            a[i].style.display = d;
        }
    }

    return {
        init:init,
        verbose:verbose,
        debug:debug,
        info:info,
        warning:warning,
        error:error,
        setVisibility:setVisibility
    }
})()
