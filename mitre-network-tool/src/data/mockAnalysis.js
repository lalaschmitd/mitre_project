export const mockAnalysis = {
  nodes: [
    { id: "A", attackVector: "Phishing" },
    { id: "B", attackVector: "Privilege Escalation" },
  ],
  edges: [
    { source: "A", target: "B", risk: "High" },
  ],
};
