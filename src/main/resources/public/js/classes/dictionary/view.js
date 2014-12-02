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
(function(undefined, document, dictionary)
{
 "use strict";

/**
 * Dictionary View Class.
 *
 * @param {HTMLElement} container The container to use for displaying the main contents.
 */

dictionary.View = function(contents)
{
 this._contents = (contents === undefined) ? document.body : contents;
 this.progress = new Image();
 this.progress.src = "../img/loading.gif";
};

/**
 * Getter for the contents container.
 */

Object.defineProperty(dictionary.View.prototype, "contents",
{
 get: function() { return this._contents; }
});

/**
 * Visualizes that the site is busy.
 *
 * @this {View}
 */

dictionary.View.prototype.showProgress = function()
{
 this.contents.appendChild(this.progress);
};

/**
 * Visualizes a given string in the main container.
 *
 * @this {View}
 * @param {string} contents The contents to display.
 */

dictionary.View.prototype.display = function(contents)
{
 while(this.contents.firstChild)
 {
  this.contents.removeChild(this.contents.firstChild);
 }

 this.contents.innerHTML = contents;
};

/**
 * Adds an anchor element that links to internal downloadable data.
 *
 * @this {View}
 * @param {string} url The url to the data object.
 */

dictionary.View.prototype.addDownloadLink = function(name, url)
{
 var div = document.createElement("div"),
  link = document.createElement("a");

 div.id = "dlWrap";
 link.id = "dl";
 link.href = url;
 link.download = name;
 link.innerHTML = "Herunterladen";
 div.appendChild(link);
 this.contents.appendChild(div);
};

/** End of Strict-Mode-Encapsulation **/
}(undefined, document, dictionary));



