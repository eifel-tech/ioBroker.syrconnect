![Logo](admin/syrconnect.png)

# ioBroker.syrconnect

[![NPM version](https://img.shields.io/npm/v/iobroker.syrconnect.svg)](https://www.npmjs.com/package/iobroker.syrconnect)
[![Downloads](https://img.shields.io/npm/dm/iobroker.syrconnect.svg)](https://www.npmjs.com/package/iobroker.syrconnect)
![Number of Installations](https://iobroker.live/badges/syrconnect-installed.svg)

![GitHub](https://img.shields.io/github/license/eifel-tech/iobroker.syrconnect?style=flat-square)
![GitHub repo size](https://img.shields.io/github/repo-size/eifel-tech/iobroker.syrconnect?logo=github&style=flat-square)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/eifel-tech/iobroker.syrconnect?logo=github&style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/eifel-tech/iobroker.syrconnect?logo=github&style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/eifel-tech/iobroker.syrconnect?logo=github&style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/eifel-tech/iobroker.syrconnect/test-and-release.yml?branch=master&logo=github&style=flat-square)

## syrconnect adapter for ioBroker

Simuliert die Syrconnect-Cloud, mit der sich die Connect-Geräte verbinden möchten. Der Adapter stellt einen Webserver
zur Verfügung, der als neues Ziel für die Connect-Geräte (z.B. Lex10) dient. Dieser wertet die gesendeten Daten aus und erzeugt
entsprechende Datenpunkte. Damit die Geräte den neuen Server finden sind folgende Voraussetzungen zu schaffen:

1. Das Gerät fragt beim konfigurierten DNS-Server nach der Domain `syrconnect.consoft.de`. Darum muss ein
   eigener DNS-Server installiert werden, der eine IP aus dem lokalen Netzwerk zurückliefert. Z.B. `Dnsmasq` tut hier, was nötig ist.
2. Die lokale IP muss auf einen lokalen Webserver verweisen, der auf Port `80` oder `443` auf `/WebServices/SyrConnectLimexWebService.asmx/GetBasicCommands`
   und `/WebServices/SyrConnectLimexWebService.asmx/GetAllCommands` lauscht.

    - Dies kann [der Adapter selbst](#adapter-als-webserver) sein, dabei gibt es aber einiges zu beachten.

    - Alle Anfragen auf einen höheren Port umrouten, kann auch mithilfe von [iptables](#umrouten-mit-iptables) erfolgen.

    - Empfohlen wird aber ein [zusätzlicher Webserver](#zusätzlicher-webserver) (z.B. [Apache](https://httpd.apache.org/)), der alle Anfragen dann an den Adapter unter
      `<iobroker-IP>:<konfigurierter Port>/GetBasicCommands` bzw. `<iobroker-IP>:<konfigurierter Port>/GetAllCommands` weiterleitet. Alternativ können die Anfragen auch an `<iobroker-IP>:<konfigurierter Port>/WebServices/SyrConnectLimexWebService.asmx/GetBasicCommands` bzw. `<iobroker-IP>:<konfigurierter Port>/WebServices/SyrConnectLimexWebService.asmx/GetAllCommands` weitergeleitet werden.

3. Der Adapter funktioniert definitiv bis Firmware-Version 2.8. Bei neuerer Firmware könnten sich diverse Dinge verändert haben, bei denen keine URL-Weiterleitung mehr möglich ist.

## Adapter als Webserver

Der Adapter muss auf Port `80` oder `443` (je nach dem auf welchem Port das Gerät sendet) konfiguriert werden. Normalerweise ist es nicht möglich, Server auf Ports <1024 ohne root-Rechte laufen zu lassen. Dies ist bei iobroker der Fall. Damit dies unter Linux trotzdem möglich ist, muss auf dem iobroker-Server folgender Befehl in der Konsole aufgerufen werden:

```
sudo setcap 'cap_net_bind_service=+ep' `which node`
```

Folgendes ist zu beachten:

-   Man erlaubt mit dieser Methode, alle Ports <1024 nach außen zu öffnen. Es muss in der Adapterinstanz nur der entsprechende Port eingetragen werden. Daher muss sichergestellt werden, dass der iobroker-Server **nicht** aus dem Internet erreichbar ist, sonst ist u.U. ein Zugriff über den konfigurierten Port möglich. **Daher ist diese Methode nicht zu empfehlen, es sei denn, man weiß, was man tut!**
-   Der Befehl muss nach einem Update der Node-Version erneut ausgeführt werden.

## Umrouten mit iptables

Ohne zusätzlichen Werbserver können unter Linux alle Requests mithilfe von iptables auf den Adapter umgeleitet werden. Dazu ist in der Konsole folgendes einzugeben. In dem Beispiel werden alle Anfragen über Port `80` und `443` auf Port `8090` umgeleitet:

```
sudo iptables -A PREROUTING -t nat -i ens18 -p tcp --dport 80 -j REDIRECT --to-port 8090 sudo iptables -A PREROUTING -t nat -i ens18 -p tcp --dport 443 -j REDIRECT --to-port 8090
```

Hier ist zu beachten, dass **alle** auf dem Server eingehenden Anfragen von jedem System im Netzwerk zum konfigurierten Port des Adapters umgeleitet werden, nicht nur die eines Syr-Gerätes.

## Zusätzlicher Webserver

Ich empfehle einen zusätzlichen Webserver (Apache, nginx etc.) zu verwenden, um die Anfragen an den Adapter weiterzuleiten. Hier kann dediziert eingestellt werden, von wem Anfragen zugelassen werden, über welche Ports diese hereinkommen dürfen und wie genau die Weiterleitung erfolgen soll. Dazu gibt es zahlreiche Beispiele im Internet.

Für einen Apache-Webserver auf dem gleichen Server, auf dem auch iobroker läuft, könnte eine Weiterleitung beispielsweise so aussehen. Hier werden nur die Anfragen des Syr-Geräts aus dem eigenen Netzwerk berücksichtigt. Diese werden auf `localhost` und dem im Adapter konfigurierten Port `8090` umgeleitet.

```
<Location /WebServices/SyrConnectLimexWebService.asmx/>
	Require ip 127.0.0.1 ::1
   Require host localhost
   Require ip <lokale IP des Syr-Geräts>

   RewriteEngine on
	RewriteCond %{REQUEST_URI} ^\/WebServices\/SyrConnectLimexWebService\.asmx\/(.*)$
    RewriteRule ^(.*)$ http://localhost:8090/%1 [QSA,P,L]
</Location>
```

## Unterstützte Geräte

-   Lex10
-   LexPlus10SL

## TODOs

-   Weitere Geräte implementieren
-   Sollte mit neuerer Firmware eine API zum Abfragen der Werte eingebaut werden, sollte der Adapter umgebaut werden, sodass die Werte direkt von der API stammen. Dann würden eigener DNS- und Webserver entfallen.

## Changelog

<!--
  Placeholder for the next version (at the beginning of the line):
  ### **WORK IN PROGRESS**
-->

### **WORK IN PROGRESS**

-   (eifel-tech) Gesendete Daten bei LEXplus10SL geändert (Issue 194)

### 1.1.0 (2024-10-30)

-   (eifel-tech) Abhängigkeit zum [iobroker Webserver](https://github.com/ioBroker/webserver) hinzugefügt
-   (eifel-tech) Fehlerhandling verbessert
-   (eifel-tech) Gerät hinzugefügt: LEXplus10SL

### 1.0.1 (2024-10-25)

-   (eifel-tech) Umbau auf aktuelle Adapterstruktur

### 0.0.1

-   (eifel-tech) initial release

### 0.0.2

-   (eifel-tech) Konfigurierbarer Host in Adminbereich

### 0.0.3

-   (eifel-tech) Vorbereitungen für weitere Geräte

### 0.0.4

-   (eifel-tech) Unterstützung mehrerer gleichartiger Geräte

### 0.0.5

-   (eifel-tech) Name des Regenerationsprogramms lesbar gemacht

### 0.1.0

-   (eifel-tech) Änderungen für js-controller 3.3

### 0.1.1

-   (eifel-tech) Adapter kann auch über `<iobroker-IP>:<konfigurierter Port>/WebServices/SyrConnectLimexWebService.asmx/GetBasicCommands` bzw. `<iobroker-IP>:<konfigurierter Port>/WebServices/SyrConnectLimexWebService.asmx/GetAllCommands` aufgerufen werden

### 0.1.2

-   (eifel-tech) Update der Abhängigkeiten

### 1.0.0

-   (eifel-tech) Vorbereitet für Node 18 und JS-Controler > 3

## License

MIT License

Copyright (c) 2024 eifel-tech <hikaso@gmx.net>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
