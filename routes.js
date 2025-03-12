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



router.get("/tree/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const findNode = (node, id) => {
    if (node.id === id) return node;
    for (let child of node.children) {
      let result = findNode(child, id);
      if (result) return result;
    }
    return null;
  };
  const node = findNode(communityTree, id);
  if (node) res.json(node);
  else res.status(404).json({ message: "Node ikke funnet" });
});

router.post("/tree", (req, res) => {
    console.log("Received request body:", req.body);  // Log received data

    const { parentId, name } = req.body;

    if (!parentId || !name) {
        console.log("❌ Missing parentId or name!");  // Debugging
        return res.status(400).json({ message: "Missing parentId or name" });
    }

    const newNode = { id: Date.now(), name, children: [] };

    console.log("🌳 Current Tree Structure:", JSON.stringify(communityTree, null, 2));


    const findAndAddNode = (node, parentId) => {
        if (!node || !node.id) {
            return false;
        }
    
        console.log(`🔍 Checking node: ${node.name} (ID: ${node.id})`);
    
        if (node.id === parentId) {
            console.log(`✅ Found parent ID: ${parentId}, adding child!`);
            node.children.push(newNode);
            return true;
        }
    
        if (!Array.isArray(node.children)) {
            return false;
        }
    
        return node.children.some(child => findAndAddNode(child, parentId));
    };
    

    if (!communityTree) {
        return res.status(500).json({ message: "Tree structure not initialized" });
    }

    const success = findAndAddNode(communityTree, parentId);

    if (success) {
        res.status(201).json(newNode);
    } else {
        console.log("❌ Parent node not found!");  // Debugging
        res.status(400).json({ message: "Parent node not found" });
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
