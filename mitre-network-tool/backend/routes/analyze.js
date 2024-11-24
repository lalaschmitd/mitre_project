const express = require("express");
const axios = require("axios");
const Technique = require("../models/Technique");

const router = express.Router();

// Route: Lade Techniken von der MITRE API
router.get("/load-mitre", async (req, res) => {
  try {
    const url = "https://raw.githubusercontent.com/mitre-attack/attack-stix-data/master/enterprise-attack/enterprise-attack.json";
    const response = await axios.get(url);
    const mitreData = response.data.objects;

    let techniques = mitreData.filter(obj => obj.type === "attack-pattern");

    // Speichere Techniken in MongoDB
    for (let technique of techniques) {
      await Technique.updateOne(
        { id: technique.id },
        {
          id: technique.id,
          name: technique.name,
          description: technique.description || "No description available",
          tactic: technique.kill_chain_phases ? technique.kill_chain_phases[0].phase_name : "Unknown",
          detection: technique.x_mitre_detection || "No detection information available",
          mitigations: technique.x_mitre_mitigations || [],
        },
        { upsert: true }
      );
    }    
    res.status(200).json({ message: `${techniques.length} techniques loaded into MongoDB.` });
  } catch (error) {
    console.error("Error loading MITRE data:", error);
    res.status(500).json({ error: "Failed to load MITRE data." });
  }
});

module.exports = router;
