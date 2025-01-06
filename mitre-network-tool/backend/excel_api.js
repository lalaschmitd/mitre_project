const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");
const path = require("path");

const app = express(); // Initialisierung

const PORT = 3000;
// Middleware zum Parsen von JSON
app.use(cors()); // CORS aktivieren
app.use(express.json());

// Route zur Verarbeitung von Knotendetails
app.post("/api/get-node-details", (req, res) => {
  const { nodeType } = req.body;

  if (!nodeType) {
    console.error("Fehlender Knotentyp");
    return res.status(400).json({ error: "Node type is required" });
  }

  try {
    // Pfad zur Excel-Datei
    const filePath = path.join(__dirname, "enterprise-attack-v16.1.xlsx");
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    console.log("Gelesene Daten aus der Excel-Datei:", rows);

    // Suche nach dem Knotentyp in der Spalte "Mapped Components"
    const matchedRow = rows.find(row => {
      if (row["Mapped Components"]) {
        const components = row["Mapped Components"]
          .split(",") // Spaltet den String anhand von Kommas
          .map(component => component.trim()); // Entfernt Leerzeichen

        console.log("Komponenten für Vergleich:", components); // Debugging

        return components.includes(nodeType); // Prüft, ob der Knotentyp enthalten ist
      }
      return false;
    });

    if (matchedRow) {
      console.log("Gefundener Eintrag:", matchedRow);
      return res.json({
        name: matchedRow["name"] || "",
        description: matchedRow["description"] || "",
      });
    } else {
      console.warn(`Kein Eintrag für ${nodeType} gefunden`);
      return res.status(404).json({ error: "Node type not found in Excel" });
    }
  } catch (error) {
    console.error("Fehler beim Lesen der Excel-Datei:", error);
    return res.status(500).json({ error: "Internal server error" });
  }

});

// Startet den Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
