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
(function(undefined, document, dictionary, History)
{
 "use strict";

/**
 * Dictionary View Class.
 *
 * @param {HTMLElement} container The container to use for displaying the main contents.
 * @param {HTMLElement} container The container to use for displaying secondary info contents.
 */

dictionary.View = function(contents, infos)
{
 this.contents = (contents === undefined) ? document.body : contents;
 this.infos = (infos === undefined) ? document.body : infos;
};

/**
 * Visualizes a given string in the main container.
 *
 * @this {View}
 * @param {string} contents The contents to display.
 */

dictionary.View.prototype.display = function(contents)
{
 this.contents.innerHTML = contents;
};

/**
 * Visualizes a given string in the info area.
 *
 * @this {View}
 * @param {string} infos The infos to display.
 */

dictionary.View.prototype.notify = function(infos)
{
 this.infos.innerHTML = infos;
};

/**
 * Visualizes a server response.
 *
 * @this {View}
 * @param {XMLHttpRequest} response An ajax object containing the actual response information.
 */

dictionary.View.prototype.displayResponse = function(response, nextURL)
{
 var data, text;

 if(response.status === 404)
 {
  this.contents.innerHTML = "<h1>Fehler 404</h1><p>Nicht gefunden.</p>";
 }
 else if(response.status === 0)
 {
  this.contents.innerHTML = "<h1>Fehler</h1><p>Der Server antwortet nicht.</p>";
 }
 else if(response.status !== 200)
 {
  this.contents.innerHTML = "<h1>Fehler " + response.status + "</h1><p>Die Anfrage ist fehlgeschlagen.</p>";
 }
 else
 {
  try
  {
   if(response.responseText)
   {
    data = JSON.parse(response.responseText);
    text = data.contents;
   }
   else
   {
    text = "<h1>Warnung</h1><p>Die vom Server erhaltene Antwort war leer.</p>";
   }
  }
  catch(e)
  {
   // The response text was no JSON string.
   text = response.responseText;
  }

  this.contents.innerHTML = text;
  History.pushState(null, null, nextURL); // responseURL would be the full URL used for this request.
 }
};

/** End of Strict-Mode-Encapsulation **/
}(undefined, document, dictionary, History));



