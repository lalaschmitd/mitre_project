Hier ist die aktualisierte README, die die Verwendung von **nodemon** berücksichtigt:

---

# MITRE Network Tool

Ein Tool zur Analyse von Netzwerk-Topologien basierend auf dem MITRE ATT&CK-Framework. Es bietet eine Weboberfläche zur Visualisierung und Bewertung von Angriffsvektoren sowie eine Backend-Logik für die Analyse.

---

## Voraussetzungen

### Systemanforderungen
- **Git** (Version 2.25 oder höher)
- **Node.js** (Version 14.x oder höher)  
  Enthält **npm** (Node Package Manager)
- **MongoDB** (lokale oder gehostete Datenbankinstanz)
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

### MongoDB installieren
1. **Installation unter Windows/macOS/Linux:**  
   [Offizielle MongoDB-Installationsanleitung](https://www.mongodb.com/docs/manual/installation/).

2. **Starten von MongoDB:**  
   ```bash
   sudo systemctl start mongod
   ```

3. **Verifikation:**  
   Prüfen, ob MongoDB läuft:
   ```bash
   sudo systemctl status mongod
   ```

### nodemon installieren
**nodemon** wird verwendet, um den Backend-Server bei Änderungen automatisch neu zu starten.
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
Das Repository klonen:
```bash
git clone <REPOSITORY_URL>
cd mitre-network-tool
```

### 2. Abhängigkeiten installieren
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
nodemon app.js
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
