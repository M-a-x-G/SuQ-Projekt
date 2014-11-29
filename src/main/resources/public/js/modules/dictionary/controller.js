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
 * @version 0.0.2, 27.11.2014
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
  requestsLocked = false, backForward = true,
  nextURL = null, postfix = "/min";

 /**
  * Sends a given object to the URL which is currently set.
  *
  * @callback sendObject
  * @param {Object} obj The object to stringify and send to the nextURL.
  */

 function sendObject(obj)
 {
  window.ajax.open("POST", nextURL + postfix, true);
  window.ajax.setRequestHeader("Content-Type", "application/json; charset=ISO-8859-1");
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
  else if(file.size > 25600000)
  {
   res.ok = false;
   res.msg = "Die angegebene Datei ist größer als 25Mb! (" + Math.round((file.size / 1024.0) / 1024) + "Mb)";
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
  var f1, f2, v1, v2, dR, sR;

  // Check if the File API is available.
  if(window.File && window.FileReader && window.FileList && window.Blob)
  {
   model.loadedFiles = 0;
   model.totalFiles = 0;

   // Check if there is a file to work with.
   if(form.definitions && form.definitions.files.length > 0)
   {
    f1 = form.definitions.files[0];
    v1 = validateFile(f1);

    if(v1.ok)
    {
     ++model.totalFiles;
     dR = new FileReader();
     window.addEvent(dR, "load", handleDefinitions);

     // Check for optional stopwords.
     if(form.stopwords && form.stopwords.files.length > 0)
     {
      f2 = form.stopwords.files[0];
      v2 = validateFile(f2);

      if(v2.ok)
      {
       ++model.totalFiles;
       sR = new FileReader();
       window.addEvent(sR, "load", handleStopwords);

       // Read definitions and stopwords.
       requestsLocked = true;
       sR.readAsText(f2, "ISO-8859-1");
       dR.readAsText(f1, "ISO-8859-1");
      }
      else
      {
       // Don't read any files and show the error message.
       view.notify(v2.msg);
      }
     }
     else
     {
      // Only read definitions.
      requestsLocked = true;
      dR.readAsText(f1, "ISO-8859-1");
     }
    }
    else
    {
     view.notify(v1.msg);
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
  var formData;

  view.notify("");

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
    formData = new FormData(firingElement);
    requestsLocked = true;
    window.ajax.open("POST", nextURL + postfix, true);
    window.ajax.timeout = 10000;
    window.ajax.send(formData);
   }
  }
  else
  {
   nextURL = firingElement.href;
   requestsLocked = true;
   window.ajax.open("GET", nextURL + postfix, true);
   window.ajax.timeout = 4000;
   window.ajax.send(null);
  }
 }

 /**
  * This function is called when a request has completely been processed.
  *
  * @this {XMLHttpRequest}
  */

 function handleResponse()
 {
  if(this.readyState === 4)
  {
   view.displayResponse(this, nextURL);
   bindListeners();
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
  view.display("<h1>Fehler</h1><p>Der Server hat nicht rechtzeitig antworten k&ouml;nnen. Versuchen Sie es sp&auml;ter erneut!</p>");
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
  view = new dictionary.View(document.getElementById("contents"), document.getElementById("footer"));

  window.addEvent(window.ajax, "readystatechange", handleResponse);
  window.addEvent(window.ajax, "timeout", handleTimeout);
  History.Adapter.bind(window, "statechange", handleBackForward);
  bindListeners();

  // Check if the File API is available.
  if(!window.File || !window.FileReader || !window.FileList || !window.Blob)
  {
   view.display("<h1>Fehler</h1><p>Die FileReader API ist in Ihrem Browser nicht verf&uuml;gbar.</p>");
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



