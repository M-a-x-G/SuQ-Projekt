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



