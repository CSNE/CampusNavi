//Very simple logging framework.
//Well maybe not that simple


/*
  A Logging framework for HTML/JS apps.

  Firstly, call Log.init() with a DOM element as its argument.
  All the logs will be displayed within the supplied element.

  You can then call one of the five methods:
  Log.verbose() - For not-so-important messages. Displayed in gray.
  Log.debug()   - For information that may be useful when debugging. Displayed in black.
  Log.info()    - For informative messages. Displayed in green.
  Log.warning() - For non-critical errors. Displayed in orange.
  Log.error()   - For critical errors. Displayed in red.
*/

var Log=(function(){
    var display=null;

    var buttonsList=[];

    var currentVisibilityOptions = [];
    
    var levelToName=["","Verbose","Debug","Info","Warning","Error"];
    var levelToCharacter = ["", "V", "D", "I", "W", "E"];

    var levelElements = [[], [], [], [], [], []];

    function init(logContainer){
        if (display!=null) throw "Cannot initialize twice!";
        
        logContainer.classList.add("loggingContainer");

        var buttonsContainer=logContainer.ownerDocument.createElement("div");
        buttonsContainer.classList.add("loggingControls");
        logContainer.appendChild(buttonsContainer);


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


        display=logContainer.ownerDocument.createElement("p");
        display.classList.add("loggingDisplay");
        logContainer.appendChild(display);


        var css = logContainer.ownerDocument.createElement("style");
        css.type = "text/css";
        var cssText="";
        cssText+= ".loggingContainer {display:flex;flex-flow: column;}\n";
        cssText+= ".loggingDisplay .level1 {color:gray;}\n";
        cssText+= ".loggingDisplay .level2 {color:black;}\n";
        cssText+= ".loggingDisplay .level3 {color:green;}\n";
        cssText+= ".loggingDisplay .level4 {color:orange;}\n";
        cssText+= ".loggingDisplay .level5 {color:red;}\n";
        cssText+= ".loggingDisplay {overflow:scroll;}\n";
        cssText+= ".loggingDisplay {font-family:consolas, monospace;}\n";
        cssText+= ".loggingDisplay {display: flex;flex-flow: column;  height: 100%;}\n";
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
            throw "No display element! Make sure init() is called with proper HTML element."
        }
    }
    function print(level,message){
        if (display!=null){



            var elem=display.ownerDocument.createElement("div");
            elem.classList.add("level" + level);
            
            //level & time
            var levelChar=levelToCharacter[level];
            //stack trace
            var stacktrace=(new Error()).stack;
            var stacks=stacktrace.split("\n");
            var lastExternalCallLocation=stacks[3].trim();
            var callLocationFormatted=/\/[^/]*:/.exec(lastExternalCallLocation)[0].slice(1,-1);//lastExternalCallLocation.split("/").pop().replace(")","");
            
            
            elem.innerHTML+="["+levelChar+"|"+timestamp()+"|"+callLocationFormatted+"] ";
            elem.innerHTML+=message;
            
            
            //if current level is disabled, hide it.
            elem.style.display =
                currentVisibilityOptions[level] ?
                "inline" : "none";


            //elem.appendChild(display.ownerDocument.createElement("br"));

            prependChild(elem);
            levelElements[level].push(elem);
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
        var d = b ? "inline" : "none";
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
