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
(function(document, dictionary, History)
{
 "use strict";

/**
 * Dictionary View Module.
 */

dictionary.View = (function()
{
 var contents;

 /**
  * Visualizes a given string.
  *
  * @param {string} contents The contents to display.
  */

 function display(contents)
 {
  contents.innerHTML = contents;
 }

 /**
  * Visualizes a server response.
  *
  * @param {XMLHttpRequest} response An ajax object containing the actual response information.
  */

 function displayResponse(response)
 {
  if(response.status === 404)
  {
   contents.innerHTML = "<h1>Fehler 404</h1><p>Nicht gefunden.</p>";
  }
  else if(response.status === 0)
  {
   contents.innerHTML = "<h1>Fehler</h1><p>Der Server antwortet nicht.</p>";
  }
  else if(response.status !== 200)
  {
   contents.innerHTML = "<h1>Fehler " + response.status + "</h1><p>Die Anfrage ist fehlgeschlagen.</p>";
  }
  else
  {
   try
   {
    contents.innerHTML = response.responseText;
    History.pushState(null, null, response.responseURL); // responseURL will be the full URL used for this request.
   }
   catch(e)
   {
    contents.innerHTML = "<h1>Fehler</h1><p>" + e.message + "</p>";
   }
  }
 }

 /**
  * Initialization.
  */

 function init()
 {
  contents = document.getElementById("contents") || document.body;
 }

 // Reveal public members.
 return {
  init: init,
  display: display,
  displayResponse: displayResponse
 };
}());

/** End of Strict-Mode-Encapsulation **/
}(document, dictionary, History));



