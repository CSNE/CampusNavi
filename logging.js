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

  function init(displayElement){
    display=displayElement;
    display.className+="loggingDisplay"
    var css = displayElement.ownerDocument.createElement("style");
    css.type = "text/css";
    var cssText="";
    cssText+= ".loggingDisplay .level1 {color:gray;}\n";
    cssText+= ".loggingDisplay .level2 {color:black;}\n";
    cssText+= ".loggingDisplay .level3 {color:green;}\n";
    cssText+= ".loggingDisplay .level4 {color:orange;}\n";
    cssText+= ".loggingDisplay .level5 {color:red;}\n";
    cssText+= ".loggingDisplay {overflow:scroll;}\n";
    css.innerHTML=cssText;
    displayElement.ownerDocument.head.appendChild(css);
  }

  function timestamp(){
    var d=new Date();
    return ""+d.getMinutes()+":"+d.getSeconds()+"."+d.getMilliseconds();
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



      var elem=display.ownerDocument.createElement("span");
      elem.classList+="level"+level;
      elem.innerHTML+=timestamp();
      elem.innerHTML+=" | ";
      elem.innerHTML+=message;
      
      elem.appendChild(display.ownerDocument.createElement("br"));

      prependChild(elem);
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

  function setVisibility(options){
    if (display!=null){
      var children = display.childNodes;
      for (var i = 0; i < children.length; i++) {
        if (children[i].classList.length>0){
          if (options[children[i].classList[0]]) children[i].style.display="inline";
          else children[i].style.display="none";
        }
        
      }
    }else{
      throw "No display element! Make sure init() is called with proper HTML element."
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


