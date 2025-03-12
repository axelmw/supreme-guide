const express = require("express");
const router = express.Router();
const communityTree = require("./data.js");
console.log("🌳 Loaded communityTree at startup:", JSON.stringify(communityTree, null, 2));


const pool = require("./db"); // Import database connection

router.get("/tree", async (req, res) => {
  try {
      const { rows } = await pool.query("SELECT * FROM tree_nodes");

      // Convert flat list into tree structure
      const nodeMap = {};
      rows.forEach(node => nodeMap[node.id] = { ...node, children: [] });

      // Attach children to parents
      const rootNodes = [];
      rows.forEach(node => {
          if (node.parent_id === null) {
              rootNodes.push(nodeMap[node.id]);
          } else {
              nodeMap[node.parent_id]?.children.push(nodeMap[node.id]);
          }
      });

      res.json(rootNodes); // Send structured tree
  } catch (error) {
      console.error("Error fetching tree nodes:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});



router.get("/tree/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  
  try {
      const { rows } = await pool.query("SELECT * FROM tree_nodes WHERE id = $1", [id]);
      
      if (rows.length === 0) {
          return res.status(404).json({ message: "Node ikke funnet" });
      }

      res.json(rows[0]);
  } catch (error) {
      console.error("❌ Error fetching node:", error);
      res.status(500).json({ message: "Database error" });
  }
});


router.post("/tree", async (req, res) => {
  console.log("Received request body:", req.body);

  const { parentId, name } = req.body;

  if (!name) {
      console.log("❌ Missing name!");
      return res.status(400).json({ message: "Missing name" });
  }

  try {
      const result = await pool.query(
          "INSERT INTO tree_nodes (name, parent_id) VALUES ($1, $2) RETURNING *",
          [name, parentId]
      );

      console.log("✅ New node added:", result.rows[0]);
      res.status(201).json(result.rows[0]); // Returnerer den nye noden
  } catch (error) {
      console.error("❌ Error inserting node:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});



router.put("/tree/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;

  const updateNode = (node, id) => {
    if (node.id === id) {
      node.name = name;
      return true;
    }
    return node.children.some(child => updateNode(child, id));
  };

  if (updateNode(communityTree, id)) {
    res.json({ message: "Node oppdatert" });
  } else {
    res.status(404).json({ message: "Node ikke funnet" });
  }
});


router.delete("/tree/:id", (req, res) => {
  const id = parseInt(req.params.id);

  console.log(`🗑️  DELETE request received for ID: ${id}`);
  console.log("🌳 Current Tree Structure:", JSON.stringify(communityTree, null, 2));

  const deleteNode = (parent, id) => {
      const index = parent.children.findIndex(child => child.id === id);
      if (index !== -1) {
          console.log(`✅ Found node ${id}, deleting...`);
          parent.children.splice(index, 1);
          return true;
      }
      return parent.children.some(child => deleteNode(child, id));
  };

  if (deleteNode({ children: [communityTree] }, id)) {
      console.log(`✅ Node ${id} deleted successfully!`);
      res.json({ message: "Node slettet" });
  } else {
      console.log(`❌ Node ${id} not found in tree!`);
      res.status(404).json({ message: "Node ikke funnet" });
  }
});


module.exports = router;
