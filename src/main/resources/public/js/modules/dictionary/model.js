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
 * Dictionary Model Module.
 */

dictionary.Model = (function()
{
 var loadedFiles = 0, totalFiles = 0,
  bundle = {
   definitions: [],
   stopwords: ""
  };

 /**
  * Sets the number of total files to load and resets loaded files.
  *
  * @param {number} x Number of total files to load.
  */

 function setTotalFiles(x)
 {
  loadedFiles = 0;
  totalFiles = x;
 }

 /**
  * Tries to send the object which contains
  * the parsed data from the input files.
  * Only sends the object when all files have been processed.
  * This function is called after each parsing process.
  *
  * @param {sendObject} callback The function to use for sending the object to the server.
  */

 function tryToSend(callback)
 {
  if(loadedFiles >= totalFiles)
  {
   callback(bundle);
  }
 }

 /**
  * Parses the contents of the definitions-file.
  * Called asynchronously when the file has been read.
  *
  * @this {FileReader}
  * @param {sendObject} callback
  * @param {ProgressEvent} event
  */

 function parseDefinitions(callback, event)
 {
  var regexp = /\r?\n|\r|^\s+|\s+$/g,
   i, j, len, arr, lastSpace, word,
   wordDefs = {
    words: [],
    definitions: []
   };

  arr = event.srcElement.result.split(':');

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
   bundle.definitions.push({
    word: wordDefs.words[i],
    definitions: wordDefs.definitions[i]
   });
  }

  ++loadedFiles;
  tryToSend(callback);
 }

 /**
  * Parses the contents of the stopwords-file.
  * Called asynchronously when the file has been read.
  *
  * @this {FileReader}
  * @param {sendObject} callback
  * @param {ProgressEvent} event
  */

 function parseStopwords(callback, event)
 {
  var i, len, regexp,
   stopwords = this.result.split(" ");

  i = 0;
  len = stopwords.length;
  regexp = len ? "/" : "";

  while(i < len)
  {
   regexp += "\\b" + stopwords[i++] + "\\b";
   regexp = (i < len) ? regexp + "|" : regexp + "/g";
  }

  bundle.stopwords = regexp;

  ++loadedFiles;
  tryToSend(callback);
 }

 /**
  * Reads the selected files in the given form.
  * Currently, this function tries to parse only two
  * specific input fields: #definitions and #stopwords.
  *
  * @param {sendObject} callback
  * @param {HTMLFormElement} form A form in the DOM.
  */

 function readFiles(callback, form)
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
    window.addEvent(definitionsReader, "load", function(event) { parseDefinitions(callback, event); });

    if(form.stopwords && form.stopwords.files.length > 0)
    {
     totalFiles = 2;
     f2 = form.stopwords.files[0];
     stopwordsReader = new FileReader();
     window.addEvent(stopwordsReader, "load", function(event) { parseStopwords(callback, event); });
     stopwordsReader.readAsText(f2, "ISO-8859-1");
    }

    definitionsReader.readAsText(f1, "ISO-8859-1");
   }
  }
 }

 /**
  * Initialization.
  */

 function init()
 {
 }

 // Reveal public members.
 return {
  init: init,
  readFiles: readFiles
 };
}());

/** End of Strict-Mode-Encapsulation **/
}(window, dictionary));



