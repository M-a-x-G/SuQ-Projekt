/**
 * Copyright (c) 2014 Raoul van Rueschen
 * Licensed under the Zlib license.
 *
 * Dictionary Model Prototype.
 * Holds the current state of the application and offers
 * methods that can change or retrieve the data.
 *
 * @author Raoul van Rueschen
 * @version 0.9.1, 13.12.2014
 */

var dictionary = dictionary || {};

// Globals that are used in this file.
(function(window, dictionary)
{
 "use strict";

/**
 * Dictionary Model.
 */

dictionary.Model = function()
{
 this._message = null;
 this._data = null;
 this._loadedFiles = 0;
 this._totalFiles = 0;
 this._bundle = {
  definitions: [],
  stopwords: null
 };
};

/**
 * Getter for message.
 */

Object.defineProperty(dictionary.Model.prototype, "message",
{
 get: function() { return this._message; },
 set: function(x) { return this._message = x; }
});

/**
 * Getter and Setter for data.
 */

Object.defineProperty(dictionary.Model.prototype, "data",
{
 get: function() { return this._data; },
 set: function(x) { return this._data = x; }
});

/**
 * Tells whether there is data available or not.
 */

Object.defineProperty(dictionary.Model.prototype, "dataURL",
{
 get: function()
 {
  return (window.URL ? window.URL.createObjectURL(this.data) : window.webkitURL.createObjectURL(this.data));
 }
});

/**
 * Tells whether there is data available.
 */

Object.defineProperty(dictionary.Model.prototype, "hasData",
{
 get: function() { return this.data !== null; }
});

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
 * Getter for bundle.
 */

Object.defineProperty(dictionary.Model.prototype, "bundle",
{
 get: function() { return this._bundle; }
});

/**
 * Tries to send the object which contains
 * the parsed data from the input files.
 * Only sends the object when all files have been processed.
 * This function is called after each parsing process.
 *
 * @this {Model}
 * @param {sendObject} callback - The function to use for sending the object to the server.
 */

dictionary.Model.prototype.tryToSend = function(callback)
{
 if(this.loadedFiles >= this.totalFiles) { callback(this.bundle); }
};

/**
 * Resets the definitions and stopwords, loaded files and total files.
 *
 * @this {Model}
 */

dictionary.Model.prototype.reset = function()
{
 // Reset the bundle of definitions and stopwords.
 this.bundle.definitions.length = 0;
 this.bundle.stopwords = null;
 this.loadedFiles = 0;
 this.totalFiles = 0;
};

/**
 * Parses the contents of the definitions-file.
 * Called asynchronously when the file has been read.
 *
 * @this {Model}
 * @param {string} result - The contents of a definitions-file.
 * @param {sendObject} callback
 */

dictionary.Model.prototype.parseDefinitions = function(result, callback)
{
 var regexp = /\r?\n|\r|^\s+|\s+$/g,
  i, j, len, arr, lastSpace,
  word, definition,
  defLookupMap = {},
  wordDefs = {
   words: [],
   definitions: []
  };

 arr = result.split(":");

 // The first element is always a single word.
 wordDefs.words.push(arr[0]);
 wordDefs.definitions.push([]);

 // Subsequent elements are definitions, which still contain a keyword at the end.
 for(i = 1, j = 0, len = arr.length; i < len; ++i)
 {
  // Not the last element.
  if(i + 1 < len)
  {
   lastSpace = arr[i].lastIndexOf(" ");

   if(lastSpace > 0)
   {
    // Extract the definition, remove line breaks and unnecessary spaces and save it by using j.
    definition = arr[i].substring(0, lastSpace).replace(regexp, "");
    // But only if it hasn't already been added!
    if(!defLookupMap[definition])
    {
     wordDefs.definitions[j].push(definition);
     defLookupMap[definition] = true;
    }

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
  else
  {
   // This is the last element in arr so there's no keyword to extract.
   wordDefs.definitions[j].push(arr[i].replace(regexp, ""));
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
 * @param {string} result - The contents of a stopwords-file.
 * @param {sendObject} callback
 */

dictionary.Model.prototype.parseStopwords = function(result, callback)
{
 var i, len, regexp,
  stopwords = result.split(" "),
  noDuplicates = [];

 // Remove duplicates.
 for(i = 0, len = stopwords.length; i < len; ++i)
 {
  if(noDuplicates.indexOf(stopwords[i]) === -1)
  {
   noDuplicates.push(stopwords[i]);
  }
 }

 // Build a regular expression string.
 i = 0;
 len = noDuplicates.length;
 regexp = len ? "/" : null;

 while(i < len)
 {
  regexp += "\b" + noDuplicates[i++] + "\b";
  regexp = (i < len) ? regexp + "|" : regexp + "/g";
 }

 this.bundle.stopwords = regexp;

 ++this.loadedFiles;
 this.tryToSend(callback);
};

/**
 * Creates an html-table with the values from the result object and 
 * prepares a downloadable text blob.
 *
 * @this {Model}
 * @param {Array<Object>} result - An array that was reconstructed from a JSON-string. Contains word:definition pairs.
 * @return {?Blob}
 */

dictionary.Model.prototype.prepareForDownload = function(result)
{
 var i, j, lenI, lenJ, word, definitions, definition,
  data = "";

 this.message = "<table><thead>\n<tr><th>Wort</th><th>Definitionen</th></tr></thead>\n<tbody>";

 for(i = 0, lenI = result.length; i < lenI; ++i)
 {
  word = result[i].word;
  definitions = result[i].definitions;
  this.message += "<tr><td>" + word + "</td><td>";

  for(j = 0, lenJ = definitions.length; j < lenJ; ++j)
  {
   definition = definitions[j];
   data += word + ": ";
   data += definition + " ";
   this.message += "<span>" + definition + "</span>";
  }

  this.message += "</td></tr>\n";
 }

 this.message += "</tbody></table>\n";

 return (data !== "") ? new Blob([data], {type: "text/plain"}) : null;
};

/**
 * Deals with a server response and prepares the received
 * data for further use.
 *
 * @this {Model}
 * @param {XMLHttpRequest} response - An ajax object containing the actual response information.
 */

dictionary.Model.prototype.extractData = function(response)
{
 var result;

 if(response.status === 404)
 {
  this.message = dictionary.Error.NOT_FOUND;
 }
 else if(response.status === 0)
 {
  this.message = dictionary.Error.NO_RESPONSE;
 }
 else if(response.status === 204)
 {
  this.message = dictionary.Error.NO_CONTENT;
 }
 else if(response.status < 200 || response.status > 299)
 {
  this.message = dictionary.Error.BAD_RESPONSE_CODE + " (" + response.status + ")";
 }
 else
 {
  this.message = dictionary.Error.EMPTY_RESPONSE;

  if(response.responseText)
  {
   try
   {
    result = JSON.parse(response.responseText);
    this.data = this.prepareForDownload(result);
   }
   catch(e)
   {
    this.message = response.responseText;
    this.data = null;
   }
  }
 }
};

/** End of Strict-Mode-Encapsulation **/
}(window, dictionary));



