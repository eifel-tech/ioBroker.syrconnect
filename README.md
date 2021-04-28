![Logo](admin/syrconnect.png)
# ioBroker.syrconnect

[![NPM version](http://img.shields.io/npm/v/iobroker.syrconnect.svg)](https://www.npmjs.com/package/iobroker.syrconnect)
[![Downloads](https://img.shields.io/npm/dm/iobroker.syrconnect.svg)](https://www.npmjs.com/package/iobroker.syrconnect)
![Number of Installations (latest)](http://iobroker.live/badges/syrconnect-installed.svg)
![Number of Installations (stable)](http://iobroker.live/badges/syrconnect-stable.svg)
[![Dependency Status](https://img.shields.io/david/eifel-tech/iobroker.syrconnect.svg)](https://david-dm.org/eifel-tech/iobroker.syrconnect)
[![Known Vulnerabilities](https://snyk.io/test/github/eifel-tech/ioBroker.syrconnect/badge.svg)](https://snyk.io/test/github/eifel-tech/ioBroker.syrconnect)

[![NPM](https://nodei.co/npm/iobroker.syrconnect.png?downloads=true)](https://nodei.co/npm/iobroker.syrconnect/)

**Tests:** [![Test and Release](https://travis-ci.com/eifel-tech/ioBroker.syrconnect.svg?branch=master)](https://travis-ci.com/github/eifel-tech/ioBroker.syrconnect)

## syrconnect adapter for ioBroker

Simuliert die Syrconnect-Cloud, mit der sich die Connect-Geräte verbinden möchten. Der Adapter stellt einen Webserver
zur Verfügung, der als neues Ziel für die Connect-Geräte (z.B. Lex10) dient. Dieser wertet die gesendeten Daten aus und erzeugt
entsprechende Datenpunkte. Damit die Geräte den neuen Server finden sind folgende Voraussetzungen zu schaffen:

1. Die Lex10 fragt beim konfigurierten DNS-Server nach der Domain <code>syrconnect.consoft.de</code>. Darum muss ein
eigener DNS-Server installiert werden, der eine IP aus dem lokalen Netzwerk zurückliefert. Z.B. <code>Dnsmasq</code> tut hier, was nötig ist.
2. Die lokale IP muss auf einen lokalen Webserver verweisen, der auf <code>Port 80</code> auf <code>/WebServices/SyrConnectLimexWebService.asmx/GetBasicCommands</code>
und <code>/WebServices/SyrConnectLimexWebService.asmx/GetAllCommands</code> lauscht. Alle Anfragen müssen dann an den Adapter unter 
<code>iobroker-IP:8090/GetBasicCommands</code> bzw. <code>iobroker-IP:8090/GetAllCommands</code> weitergeleitet werden.

## TODOs
* Leider ist sowohl ein eigener DNS-Server, der auf <code>Port 53</code> lauscht, als auch ein Webserver für <code>Port 80</code> 
bisher nicht möglich, in den Adapter zu implementieren, weil der Adapter dann mit Root-Rechten gestartet werden müsste.
Da iobroker aber nicht als <code>root</code> ausgeführt wird, ist dies z.Zt. nicht möglich.

## Changelog

### 0.0.1
* (eifel-tech) initial release

### 0.0.2
* (eifel-tech) Konfigurierbarer Host in Adminbereich

### 0.0.3
* (eifel-tech) Vorbereitungen für weitere Geräte

### 0.0.4
* (eifel-tech) Unterstützung mehrerer gleichartiger Geräte

## License
MIT License

Copyright (c) 2021 eifel-tech <tw73149315m@gmx.net>

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
