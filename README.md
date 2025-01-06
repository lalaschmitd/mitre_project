# MITRE Network Tool

Ein Tool zur Analyse von Netzwerk-Topologien basierend auf dem MITRE ATT&CK-Framework. Es bietet eine Weboberfläche zur Visualisierung und Bewertung von Angriffsvektoren sowie eine Backend-Logik für die Analyse.

---

## Voraussetzungen

### Systemanforderungen
- **Git** (Version 2.25 oder höher)
- **Node.js** (Version 14.x oder höher)  
  Enthält **npm** (Node Package Manager)
- **xlsx** (lokale oder gehostete Datenbankinstanz)
- **nodemon** (für die automatische Überwachung des Backends während der Entwicklung)

---

## Einrichtung von Git, Node.js (npm), MongoDB und nodemon

### Git installieren
Git wird benötigt, um das Repository zu klonen.
1. **Installation unter Windows:**  
   [Git für Windows herunterladen](https://git-scm.com/download/win).

2. **Installation unter macOS:**  
   Über Homebrew:
   ```bash
   brew install git
   ```

3. **Installation unter Linux (Ubuntu/Debian):**  
   ```bash
   sudo apt update
   sudo apt install git
   ```

4. **Verifikation:**  
   Prüfen, ob Git erfolgreich installiert wurde:
   ```bash
   git --version
   ```

### Node.js und npm installieren
1. **Installation:**  
   [Node.js herunterladen](https://nodejs.org/).

2. **Verifikation:**  
   Die Versionen überprüfen:
   ```bash
   node --version
   npm --version
   ```

### nodemon installieren
**nodemon** wird verwendet, um den Backend-Server bei Änderungen automatisch neu zu starten.
In einer bash oder Konsole führe folgenden Befehl aus:
```bash
npm install -g nodemon
```
Verifikation:
```bash
nodemon --version
```

---

## Installation des Projekts

### 1. Repository klonen
Klonen ohne GitHub Desktop:
Öffne einen Ordner, worin das Projekt gespeichert werden soll. Öffne Git Bash (Rechtsklick im Ordner evtl. noch auf "Weitere Optionen anzeigen" drüchen unter "Open Git Bash here").
Führe folgenden Befehl aus:
Das Repository klonen:
```bash
git clone https://github.com/lalaschmitd/mitre_project.git
```
Um innerhalb des Bash auf das Projektverzeichnis zuzugreifen wird dieser Befehl benötigt:
```bash
cd mitre_project
```


### 2. Abhängigkeiten installieren
Nach erfolgreichem Klonen befindet sich das Projektverzeichnis in dem geöffneten Ordner. Innerhalb des Git Bash, führe weiterhin folgende Befehle aus, um die Funktionen von Node.js im Frontend und Backend zu verwenden.
#### Frontend:
```bash
cd mitre-network-tool
npm install
```

#### Backend:
```bash
cd backend
npm install
```

---

## Anwendung starten

### Backend starten
Das Backend wird mit nodemon gestartet:
```bash
cd backend
nodemon excel_api.js
```

### Frontend starten
Das Frontend wird gestartet:
```bash
cd mitre-network-tool
npm run serve
```

### Zugriff auf die Anwendung
Die Anwendung ist unter [http://localhost:8080](http://localhost:8080) verfügbar.

---
