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
 * @version 0.0.1, 02.11.2014
 */

var general = general || {};

// Defines the global objects that are used in this file.
(function(undefined, window, document, general)
{
 "use strict";

/**
 * Dictionary Module.
 * Derived from the Stay module; modified to parse
 * files locally and send the contents as JSON.
 *
 * Also used for requesting page content asynchronously
 * while staying on one main page.
 *
 * Each request has a hard timeout to avoid endless
 * loading times that are often deemed to fail anyways.
 * (POST-Request currently don't have a hard timeout.)
 */

general.Dictionary = (function()
{
 var contents,
  localEventCache = [], nextPage = null,
  locked = false, backForward = true,
  loadedFiles = 0, totalFiles = 0,
  obj = {
   definitions: [],
   stopwords: null
  };

 /**
  * Tries to send the object which contains
  * the parsed data from the input files.
  * Only sends the object when all files have
  * been processed. Called asynchronously after 
  * each parsing process.
  */

 function tryToSend()
 {
  if(loadedFiles >= totalFiles)
  {
   general.ajax.open("POST", nextPage, true);
   general.ajax.setRequestHeader("Content-Type", "application/json; charset=ISO-8859-1");
   general.ajax.send(JSON.stringify(obj));
  }
 }

 /**
  * Parses the contents of the definitions-file.
  * Called asynchronously when the file has been read.
  *
  * @this {FileReader}
  */

 function parseDefinitions(event)
 {
  var regex = /\r?\n|\r|^\s+|\s+$/g,
   i, j, len, arr, lastSpace, word, wordDefs;

  arr = this.result.split(':');

  // The first element is always a single word.
  wordDefs = {
   words: [],
   definitions: []
  };
  wordDefs.words.push(arr[0]);
  wordDefs.definitions.push([]);

  // Subsequent elements are definitions, which still contain a keyword at the end.
  for(i = 1, j = 0, len = arr.length; i < len; ++i)
  {
   lastSpace = arr[i].lastIndexOf(' ');

   if(lastSpace > 0)
   {
    // Extract the definition, remove line breaks and unnecessary spaces and save it by using j.
    wordDefs.definitions[j].push(arr[i].substring(0, lastSpace).replace(regex, ''));

    // Extract the word.
    word = arr[i].substring(++lastSpace, arr[i].length);

    // Check if the word is already in the array and if so: use its index.
    j = wordDefs.words.indexOf(word);

    // Otherwise, push it and make some room for more definitions.
    if(j < 0)
    {
     j = wordDefs.words.push(word) - 1;
     wordDefs.definitions.push([]);
    }
   }
  }

  for(i = 0, len = wordDefs.words.length; i < len; ++i)
  {
   obj.definitions.push({
    word: wordDefs.words[i],
    definitions: wordDefs.definitions[i]
   });
  }

  ++loadedFiles;
  tryToSend();
 }

 /**
  * Parses the contents of the stopwords-file.
  * Called asynchronously when the file has been read.
  *
  * @this {FileReader}
  */

 function parseStopwords(event)
 {
  var i, len,
   stopwords,
   regexp = "";

  stopwords = this.result.split(' ');

  i = 0;
  len = stopwords.length;

  if(len)
  {
   regexp = "/";
  }

  while(i < len)
  {
   regexp += "\\b" + stopwords[i++] + "\\b";

   if(i < len)
   {
    regexp += "|";
   }
   else
   {
    regexp += "/g";
   }
  }

  obj.stopwords = regexp;
  console.log(obj.stopwords);

  ++loadedFiles;
  tryToSend();
 }

 /**
  * Reads the selected files in the given form.
  * Only tries to parse two specific inputs with ID
  * #definitions and #stopwords.
  *
  * @param {HTMLFormElement} form A form in the DOM.
  */

 function readFiles(form)
 {
  var f1, f2, definitionsReader, stopwordsReader;

  // Check if the File API is available.
  if(window.File && window.FileReader && window.FileList && window.Blob)
  {
   loadedFiles = 0;

   if(form.definitions && form.definitions.files.length > 0)
   {
    totalFiles = 1;
    f1 = form.definitions.files[0];
    definitionsReader = new FileReader();
    window.addEvent(definitionsReader, "load", parseDefinitions);

    if(form.stopwords && form.stopwords.files.length > 0)
    {
     totalFiles = 2;
     f2 = form.stopwords.files[0];
     stopwordsReader = new FileReader();
     window.addEvent(stopwordsReader, "load", parseStopwords);

     stopwordsReader.readAsText(f2, "ISO-8859-1");
    }

    definitionsReader.readAsText(f1, "ISO-8859-1");
   }
   else
   {
    locked = false;
   }
  }
  else
  {
   contents.innerHTML = "<h1>Fehler</h1><p>Die FileReader API ist in Ihrem Browser nicht verf&uuml;gbar.</p>";
  }
 }

 /**
  * Uses ajax to request pages.
  * Locks the request system until the response has
  * been received and processed.
  * 
  * @param {HTMLElement} firingElement A registered element whose click or submit event was triggered.
  */

 function navigate(firingElement)
 {
  locked = true;

  // Read and parse files if the firing element is a form.
  if(firingElement.action)
  {
   nextPage = firingElement.action;
   readFiles(firingElement);
  }
  else
  {
   nextPage = firingElement.href;
   general.ajax.open("GET", nextPage, true);
   general.ajax.timeout = 4000;
   general.ajax.send(null);
  }
 }

 /**
  * This function acts when a request has completely been processed.
  *
  * @this {XMLHttpRequest}
  */

 function processResponse()
 {
  var response;

  if(this.readyState === 4)
  {
   if(this.status === 404)
   {
    contents.innerHTML = "<h1>Fehler 404</h1><p>Nicht gefunden.</p>";
   }
   else if(this.status === 0)
   {
    contents.innerHTML = "<h1>Fehler</h1><p>Der Server antwortet nicht.</p>";
   }
   else if(this.status !== 200)
   {
    contents.innerHTML = "<h1>Fehler " + this.status + "</h1><p>Die Anfrage ist fehlgeschlagen.</p>";
   }
   else
   {
    try
    {
     contents.innerHTML = this.responseText;

     // Use the History API only if it's available.
     if(History.Adapter)
     {
      History.pushState(null, response.title, nextPage); // this.responseURL may contain rubbish at the end.
     }
    }
    catch(e)
    {
     contents.innerHTML = "<h1>Fehler</h1><p>" + e.message + "</p>";
    }
   }

   locked = false;
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
  var isRightClick = false;

  if(event.which)
  {
   isRightClick = (event.which === 3);
  }
  else if(event.button)
  {
   isRightClick = (event.button === 2);
  }

  if(!isRightClick && !locked)
  {
   event.preventDefault();
   backForward = false;
   navigate(this);
  }
 }

 /**
  * Binds event listeners to all links and forms.
  * Always release before binding.
  */

 function bind()
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
  * Initialization.
  */

 function init()
 {
  contents = document.getElementById("contents") || document.body

  // Listen to ajax ready-state changes.
  window.addEvent(general.ajax, "readystatechange", processResponse);

  // A simple listener that deals with ajax timeouts.
  window.addEvent(general.ajax, "timeout", function()
  {
   contents.innerHTML = "<h1>Fehler</h1><p>Der Server hat nicht rechtzeitig antworten k&ouml;nnen. Versuchen Sie es sp&auml;ter erneut!</p>";
   locked = false;
  });

  // Listen to history state changes.
  if(History.Adapter)
  {
   History.Adapter.bind(window, "statechange", handleBackForward);
  }

  // Bind all links and forms to event listeners.
  bind();
 }

 // Initialized when DOM content is loaded.
 window.addEvent(document, "DOMContentLoaded", init);
}());

/** End of Strict-Mode-Encapsulation **/
}(undefined, window, document, general));



