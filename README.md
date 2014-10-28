
Aufgabe: Bücherverwaltung
=========================
Ein Bücherwurm möchte seine gelesenen Bücher auf einer Webpräsenz auflisten. Die Webseite soll aus mindestens
zwei Seiten bestehen. Eine Seite zum Auflisten der Bücher und eine Seite zum Speichern der Bücherdaten durch ein Formular. 
Das Formular soll die Möglichkeit bieten, folgende Daten zu erfassen:

* Titel
* Autor
* Jahr
* Verlag
* Cover-Bild

Die Cover­Bilder sollen über das Formular auf S3 gespeichert werden und über CloudFront bereitgestellt werden.
Die Quellpfade zu den Cover­Bildern und die restlichen Daten sollen auf DynamoDB gespeichert werden. Die Webseite muss 
auf einer EC2­Instanz oder Elastic Beanstalk bereitgestellt werden.

Features:

* Suche nach eingetragenen Büchern
  * Suche nach Titel, Autor, Jahr
  * Suche auf Seite, auf der auch dei gesamte Liste ausgegeben wird

* Eintragen von neuen Büchern
  * Warnung bei unzureichender Dateneingabe (fehlendes Jahr, fehlender Autor)
  * Nach Warnung speichern dennoch möglich

