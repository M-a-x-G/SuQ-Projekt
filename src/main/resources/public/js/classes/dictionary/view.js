/**
 * Copyright (c) 2014 Raoul van Rueschen
 * Licensed under the Zlib license.
 *
 * Dictionary View Prototype.
 * Manipulates the DOM in order to show the current 
 * state of the application.
 *
 * @author Raoul van Rueschen
 * @version 0.9.1, 13.12.2014
 */

var dictionary = dictionary || {};

// Globals that are used in this file.
(function(document, dictionary, undefined)
{
 "use strict";

/**
 * Dictionary View.
 *
 * @param {HTMLElement} container - The container to use for displaying the main contents.
 */

dictionary.View = function(contents)
{
 this._contents = (contents === undefined) ? document.body : contents;
 this._progress = new Image();
 this._progress.src = "../img/loading.gif";
};

/**
 * Getter for the contents container.
 */

Object.defineProperty(dictionary.View.prototype, "contents",
{
 get: function() { return this._contents; }
});

/**
 * Getter for the progress image.
 */

Object.defineProperty(dictionary.View.prototype, "progress",
{
 get: function() { return this._progress; }
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
 * @param {string} contents - The contents to display.
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
 * @param {string} url - The url to the data object.
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
}(document, dictionary));



