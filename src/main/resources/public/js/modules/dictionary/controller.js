/**
 * Copyright (c) 2014 Raoul van Rueschen
 * 
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 * 
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *  1. The origin of this software must not be misrepresented; you must not
 *     claim that you wrote the original software. If you use this software
 *     in a product, an acknowledgment in the product documentation would be
 *     appreciated but is not required.
 *  2. Altered source versions must be plainly marked as such, and must not be
 *     misrepresented as being the original software.
 *  3. This notice may not be removed or altered from any source distribution.

 * @author Raoul van Rueschen
 * @version 0.1.0, 01.12.2014
 */

var dictionary = dictionary || {};

// Defines the global objects that are used in this file.
(function(window, document, dictionary, History)
{
 "use strict";

/**
 * Dictionary Controller Module.
 */

dictionary.Controller = (function()
{
 var model, view, localEventCache = [],
  definitionsReader, stopwordsReader,
  requestsLocked = false, backForward = true,
  nextURL = null, shortcut = "/min/", charset = "UTF-8"/*"iso-8859-1"*/;

 /**
  * Sends a given object to the URL which is currently set.
  *
  * @callback sendObject
  * @param {Object} obj The object to stringify and send to the nextURL.
  */

 function sendObject(obj)
 {
  //console.log(obj);
  window.ajax.open("POST", nextURL, true);
  window.ajax.setRequestHeader("Content-Type", "application/json; charset=" + charset);
  window.ajax.timeout = 0;
  window.ajax.send(JSON.stringify(obj));
 }

 /**
  * Processes the data that has been read by the FileReader.
  *
  * @this {FileReader}
  * @param {ProgressEvent} event
  */

 function handleDefinitions(event)
 {
  model.parseDefinitions(this.result, sendObject);
 }

 /**
  * Processes the data that has been read by the FileReader.
  *
  * @this {FileReader}
  * @param {ProgressEvent} event
  */

 function handleStopwords(event)
 {
  model.parseStopwords(this.result, sendObject);
 }

 /**
  * Validates a file.
  *
  * @param {File} file
  * @return {Object} The result of the validation.
  */

 function validateFile(file)
 {
  var res = {ok: true, msg: ""},
   a = file.name.split("."),
   extension = (a.length === 1 || (a[0] === "" && a.length === 2)) ? "" : a.pop();

  if(extension !== "in")
  {
   res.ok = false;
   res.msg = "Die angegebene Datei \"" + file.name + "\" weist nicht den richtigen Dateityp auf!";
  }
  else if(file.size > 20971520)
  {
   res.ok = false;
   res.msg = "Die angegebene Datei ist größer als 20Mb! (" + Math.round((file.size / 1024.0) / 1024) + "Mb)";
  }

  return res;
 }

 /**
  * Reads the selected files in the given form.
  * Currently, this function tries to read only two
  * specific file input fields: #definitions and #stopwords.
  *
  * @param {HTMLFormElement} form A form in the DOM.
  */

 function readFiles(form)
 {
  var f1, f2, v1, v2;

  // Check if the File API is available.
  if(window.File && window.FileReader && window.FileList && window.Blob)
  {
   // Check if there is a file to work with.
   if(form.definitions && form.definitions.files.length > 0)
   {
    model.reset();

    f1 = form.definitions.files[0];
    v1 = validateFile(f1);

    if(v1.ok)
    {
     ++model.totalFiles;

     // Check for optional stopwords.
     if(form.stopwords && form.stopwords.files.length > 0)
     {
      f2 = form.stopwords.files[0];
      v2 = validateFile(f2);

      if(v2.ok)
      {
       ++model.totalFiles;

       // Read definitions and stopwords.
       requestsLocked = true;
       view.showProgress();
       stopwordsReader.readAsText(f2, charset);
       definitionsReader.readAsText(f1, charset);
      }
      else
      {
       // Don't read any files and show the error message.
       view.display(v2.msg);
      }
     }
     else
     {
      // Only read definitions.
      requestsLocked = true;
      view.showProgress();
      definitionsReader.readAsText(f1, charset);
     }
    }
    else
    {
     view.display(v1.msg);
    }
   }
  }
 }

 /**
  * Uses ajax to issue requests.
  * Locks the request system until the response has
  * been received and processed.
  * 
  * @param {HTMLElement} firingElement An element whose click or submit event was triggered.
  */

 function navigate(firingElement)
 {
  var formData, index;

  if(firingElement.action)
  {
   nextURL = firingElement.action;

   // Read and parse files if the firing element is the upload form.
   if(firingElement.id === "upload")
   {
    readFiles(firingElement);
   }
   else
   {
    requestsLocked = true;
    view.showProgress();
    window.ajax.open("GET", nextURL + "?" + serialize(firingElement), true);
    window.ajax.timeout = 0;
    window.ajax.send(null);
   }
  }
  else
  {
   nextURL = firingElement.href;
   requestsLocked = true;
   index = nextURL.lastIndexOf("/");
   window.ajax.open("GET", nextURL.substring(0, index) + shortcut + nextURL.substring(index + 1, nextURL.length), true);
   window.ajax.timeout = 0;
   window.ajax.send(null);
  }
 }

 /**
  * This function is called when the server has responded to a request.
  *
  * @this {XMLHttpRequest}
  */

 function handleResponse()
 {
  var resText;

  if(this.readyState === 4)
  {
   model.extractData(this);
   view.display(model.message);
   bindListeners();
   nextURL = (nextURL.indexOf(".html") < 0) ? nextURL.substring(0, nextURL.lastIndexOf("/")) + "/index.html" : nextURL;
   History.pushState(null, null, nextURL); // this.responseURL would contain the full URL used for this request.

   if(model.hasData)
   {
    view.addDownloadLink("dict.out", model.dataURL);
   }

   requestsLocked = false;
  }
 }

 /**
  * This function is bound to all links and forms
  * and executes the desired page navigation on left clicks.
  *
  * The context in which this function is called allows access
  * to all attributes of the respective "a" or "submit" element.
  *
  * @this {HTMLElement}
  */

 function handlePageSwitch(event)
 {
  var rightClick = false;

  event.preventDefault();

  if(event.which)
  {
   rightClick = (event.which === 3);
  }
  else if(event.button)
  {
   rightClick = (event.button === 2);
  }

  if(!rightClick && !requestsLocked)
  {
   backForward = false;
   navigate(this);
  }
 }

 /**
  * Support browser functionality "back" and "forward".
  * Depends on the boolean variable backForward in order to
  * determine whether this navigation should be executed.
  */

 function handleBackForward()
 {
  var state = History.getState();

  if(backForward)
  {
   navigate({href: state.cleanUrl});
  }
  else
  {
   backForward = true;
  }
 }

 /**
  * Acts when an ajax timeout occurs.
  */

 function handleTimeout()
 {
  view.display(dictionary.Error.TIMEOUT);
  requestsLocked = false;
 }

 /**
  * Binds event listeners to all links and forms.
  * Always releases the listeners which were bound 
  * in this context before binding.
  */

 function bindListeners()
 {
  var links = document.getElementsByTagName("a"),
   forms = document.getElementsByTagName("form"),
   i, len, signature, lECi;

  for(i = 0, len = localEventCache.length; i < len; ++i)
  {
   lECi = localEventCache[i];
   window.removeEvent(lECi[0], lECi[1], lECi[2]);
  }

  for(i = 0, len = links.length; i < len; ++i)
  {
   signature = window.addEvent(links[i], "click", handlePageSwitch);
   localEventCache.push(signature);
  }

  for(i = 0, len = forms.length; i < len; ++i)
  {
   signature = window.addEvent(forms[i], "submit", handlePageSwitch);
   localEventCache.push(signature);
  }
 }

 /**
  * Initialization.
  */

 function init()
 {
  model = new dictionary.Model();
  view = new dictionary.View(document.getElementById("contents"));

  window.addEvent(window.ajax, "readystatechange", handleResponse);
  window.addEvent(window.ajax, "timeout", handleTimeout);
  History.Adapter.bind(window, "statechange", handleBackForward);
  bindListeners();

  definitionsReader = new FileReader();
  stopwordsReader = new FileReader();
  window.addEvent(definitionsReader, "load", handleDefinitions);
  window.addEvent(stopwordsReader, "load", handleStopwords);

  // Check if the File API is available.
  if(!window.File || !window.FileReader || !window.FileList || !window.Blob)
  {
   view.display(dictionary.Error.FILEREADER);
  }
 }

 // Reveal public members.
 return {
  init: init
 };
}());

// Initialized when DOM content is loaded.
window.addEvent(document, "DOMContentLoaded", dictionary.Controller.init);

/** End of Strict-Mode-Encapsulation **/
}(window, document, dictionary, History));



