/**
 * Copyright (c) 2014 Raoul van Rueschen
 * Licensed under the Zlib license.
 *
 * Error Message Enumeration.
 *
 * @author Raoul van Rueschen
 * @version 0.9.1, 13.12.2014
 */

var dictionary = dictionary || {};

// Defines the global objects that are used in this file.
(function(dictionary)
{
 "use strict";

/**
 * Enumeration of Errors.
 */

dictionary.Error = Object.freeze({
 TIMEOUT: "<h1>Fehler - Zeit&uuml;berschreitung</h1><p>Der Server hat nicht rechtzeitig antworten k&ouml;nnen. Versuchen Sie es sp&auml;ter erneut!</p>",
 FILEREADER: "<h1>Fehler - API nicht verf&uuml;gbar</h1><p>Die FileReader API ist in Ihrem Browser nicht verf&uuml;gbar.</p>",
 EMPTY: "<h1>Fehler - Leere Antwort</h1><p>Die vom Server erhaltene Antwort war leer.</p>",
 BAD_RESPONSE_CODE: "<h1>Fehler - Schlechter Status Code</h1><p>Die Anfrage ist fehlgeschlagen.</p>",
 NO_RESPONSE: "<h1>Fehler - Keine Verbindung</h1><p>Der Server antwortet nicht.</p>",
 NO_CONTENT: "<h1>Kein Inhalt</h1><p>Die Anfrage lieferte keine Ergebnisse.</p>",
 NOT_FOUND: "<h1>Fehler - 404</h1><p>Nicht gefunden.</p>"
});

/** End of Strict-Mode-Encapsulation **/
}(dictionary));



