Vollständig indiziertes Wörterbuch (VIW)
==================================

<b>Es ist ein Generator für ein vollständig indiziertes Wörterbuch zu erstellen.
Der Generator erhält eine Liste von Wörtern und Definitionen. Daraus generiert er:</b>
<ol>
<li> eine alphabetisch sortierte Liste der Wörter mit ihren Definitionen.</li>
<li> einen alphabetisch sortierten Index der Wörter, die in den Definitionen stehen. </li>
</ol>

Der Generator hat viele Einsatzmöglichkeiten, dazu gehört das Auflisten aller Wörter und deren Definitionen oder das suchen von Defintionen, die einen bestimmten Begriff beinhalten.

<b>Erforderliche Eigenschaften (features)
Der VIW-Generator:</b>
<ol>
<li> darf nur einen Eintrag für Wörter mit mehreren Definitionen erstellen. Alle unterschiedlichen Definitionen zu einem Wort müssen in eine sinnvolle Reihenfolge gebracht werden (z. B. Reihenfolge der Eingabe).</li>
	
<li> muss eine Liste von "Stoppwörtern" (stopwords) akzeptieren. Diese Wörter dürfen nicht im Index<br>
(als Schlagwort ) erscheinen.</li>
    
<li> muss ein Interface liefern, durch das Benutzer ein Wort nachschlagen oder alle Definitionen, die einen bestimmten Begriff beinhalten, suchen kann.</li>
	
<li> muss eine Möglichkeit bieten, die Daten des VIW zu speichern und zu laden, ohne, dass jedes Mal aus den Eingabedaten ein neues Wörterbuch generiert wird.</li>
    
<li> muss Eingabedaten in dem Format der Beispieldateien unterstützen. Die Ausgabedaten können in irgendeinem geeigneten Format gespeichert werden. Die Beispieldateien zur Ausgabe zeigen, wie die Information für den Benutzer dargestellt werden soll.</li>
    
<li> muss unabhängig von Diensten des Betriebssystem sein, z. B. kein Einsatz von sort oder ptx in Unix. </li>
</ol>
<b>Optionale Eigenschaften (features)</b>
<ol>
<li> Der VIW-Generator kann über zusätzliche Eigenschaften verfügen, z. B. Abfragen von Definitionen 
(Beispiel s. Duden http://www.duden.de/rechtschreibung/)</li>

<li> Der VIW-Generator kann über das Internet zugänglich sein, aber auch als App für Smartphones oder Tablet-PC zur Verfügung stehen.</li>

<li> Weitere Erweiterungen können vom Kunden jederzeit hinzugefügt werden.</li>
</ol>

Config
==================================
In der Datei [application.properties](https://github.com/M-a-x-G/SuQ-Projekt/blob/master/src/main/resources/application.properties) muss etw. Nutzername und Passwort angepasst werden.

Zum importieren:

    gradle idea

**oder**

    gradle eclipse

Zum starten:

    gradle bootRun
