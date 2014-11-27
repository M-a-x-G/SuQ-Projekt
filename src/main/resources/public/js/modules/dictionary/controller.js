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
(function(window, document, general, dictionary, History)
{
 "use strict";

/**
 * Dictionary Controller Module.
 */

dictionary.Controller = (function()
{
 var requestsLocked = false, backForward = true,
  localEventCache = [], nextURL = null;

 /**
  * Sends a given object to the URL which is currently set.
  *
  * @callback sendObject
  * @param {Object} obj The object to stringify and send to the nextURL.
  */

 function sendObject(obj)
 {
  general.ajax.open("POST", nextURL, true);
  general.ajax.setRequestHeader("Content-Type", "application/json; charset=ISO-8859-1");
  general.ajax.send(JSON.stringify(obj));
 }

 /**
  * Uses ajax to request pages.
  * Locks the request system until the response has
  * been received and processed.
  * 
  * @param {HTMLElement} firingElement An element whose click or submit event was triggered.
  */

 function navigate(firingElement)
 {
  // Read and parse files if the firing element is a form.
  if(firingElement.action)
  {
   requestsLocked = (firingElement.definitions && firingElement.definitions.files.length > 0);
   nextURL = firingElement.action;
   dictionary.Model.readFiles(sendObject, firingElement);
  }
  else
  {
   requestsLocked = true;
   nextURL = firingElement.href;
   general.ajax.open("GET", nextURL, true);
   general.ajax.timeout = 4000;
   general.ajax.send(null);
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
   dictionary.View.displayResponse(this);
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
   event.preventDefault();
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
  dictionary.View.display("<h1>Fehler</h1><p>Der Server hat nicht rechtzeitig antworten k&ouml;nnen. Versuchen Sie es sp&auml;ter erneut!</p>");
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
  window.addEvent(general.ajax, "readystatechange", handleResponse);
  window.addEvent(general.ajax, "timeout", handleTimeout);
  History.Adapter.bind(window, "statechange", handleBackForward);
  bindListeners();

  // Check if the File API is available.
  if(!window.File || !window.FileReader || !window.FileList || !window.Blob)
  {
   dictionary.View.display("<h1>Fehler</h1><p>Die FileReader API ist in Ihrem Browser nicht verf&uuml;gbar.</p>");
  }
 }

 // Reveal public members.
 return {
  init: init
 };
}());

// Initialized when DOM content is loaded.
window.addEvent(document, "DOMContentLoaded", function()
{
 dictionary.Model.init();
 dictionary.View.init();
 dictionary.Controller.init();
});

/** End of Strict-Mode-Encapsulation **/
}(window, document, general, dictionary, History));



