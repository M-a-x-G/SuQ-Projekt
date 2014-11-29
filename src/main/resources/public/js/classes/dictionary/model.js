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
(function(window, dictionary)
{
 "use strict";

/**
 * Dictionary Model Class.
 */

dictionary.Model = function()
{
 this._loadedFiles = 0;
 this._totalFiles = 0;
 this.bundle = {
  definitions: [],
  stopwords: ""
 };
};

/**
 * Getter and Setter for loadedFiles.
 */

Object.defineProperty(dictionary.Model.prototype, "loadedFiles",
{
 get: function() { return this._loadedFiles; },
 set: function(x) { this._loadedFiles = x; }
});

/**
 * Getter and Setter for totalFiles.
 */

Object.defineProperty(dictionary.Model.prototype, "totalFiles",
{
 get: function() { return this._totalFiles; },
 set: function(x) { this._totalFiles = x; }
});

/**
 * Tries to send the object which contains
 * the parsed data from the input files.
 * Only sends the object when all files have been processed.
 * This function is called after each parsing process.
 *
 * @this {Model}
 * @param {sendObject} callback The function to use for sending the object to the server.
 */

dictionary.Model.prototype.tryToSend = function(callback)
{
 if(this.loadedFiles >= this.totalFiles) { callback(this.bundle); }
};

/**
 * Parses the contents of the definitions-file.
 * Called asynchronously when the file has been read.
 *
 * @this {Model}
 * @param {string} result
 * @param {sendObject} callback
 */

dictionary.Model.prototype.parseDefinitions = function(result, callback)
{
 var regexp = /\r?\n|\r|^\s+|\s+$/g,
  i, j, len, arr, lastSpace, word,
  wordDefs = {
   words: [],
   definitions: []
  };

 arr = result.split(':');

 // The first element is always a single word.
 wordDefs.words.push(arr[0]);
 wordDefs.definitions.push([]);

 // Subsequent elements are definitions, which still contain a keyword at the end.
 for(i = 1, j = 0, len = arr.length; i < len; ++i)
 {
  lastSpace = arr[i].lastIndexOf(' ');

  if(lastSpace > 0)
  {
   // Extract the definition, remove line breaks and unnecessary spaces and save it by using j.
   wordDefs.definitions[j].push(arr[i].substring(0, lastSpace).replace(regexp, ''));
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
  this.bundle.definitions.push({
   word: wordDefs.words[i],
   definitions: wordDefs.definitions[i]
  });
 }

 ++this.loadedFiles;
 this.tryToSend(callback);
};

/**
 * Parses the contents of the stopwords-file.
 * Called asynchronously when the file has been read.
 *
 * @this {Model}
 * @param {string} result
 * @param {sendObject} callback
 */

dictionary.Model.prototype.parseStopwords = function(result, callback)
{
 var i, len, regexp,
  stopwords = result.split(" ");

 i = 0;
 len = stopwords.length;
 regexp = len ? "/" : "";

 while(i < len)
 {
  regexp += "\b" + stopwords[i++] + "\b";
  regexp = (i < len) ? regexp + "|" : regexp + "/g";
 }

 this.bundle.stopwords = regexp;

 ++this.loadedFiles;
 this.tryToSend(callback);
};

/** End of Strict-Mode-Encapsulation **/
}(window, dictionary));



