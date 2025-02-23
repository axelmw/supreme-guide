const express = require("express");
const router = express.Router();
const communityTree = require("./data");
console.log("🌳 Loaded communityTree:", communityTree); 


// Hent hele treet
router.get("/tree", (req, res) => {
  res.json(communityTree);
});

// Hent en spesifikk node basert på ID
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

// Legg til en ny node
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
    
        // Ensure node.children exists before using `.some()`
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


  

// Oppdater en node
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

// Slett en node
router.delete("/tree/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const deleteNode = (parent, id) => {
    const index = parent.children.findIndex(child => child.id === id);
    if (index !== -1) {
      parent.children.splice(index, 1);
      return true;
    }
    return parent.children.some(child => deleteNode(child, id));
  };

  if (deleteNode(communityTree, { children: [communityTree] })) {
    res.json({ message: "Node slettet" });
  } else {
    res.status(404).json({ message: "Node ikke funnet" });
  }
});

module.exports = router;
