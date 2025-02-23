const express = require("express");
const router = express.Router();
let communityTree = require("./data"); // Importer datastrukturen

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
    const { parentId, name } = req.body;  // Get data from request
  
    if (!parentId || !name) {
      return res.status(400).json({ message: "Missing parentId or name" });
    }
  
    const newNode = { id: Date.now(), name, children: [] };
  
    const findAndAddNode = (node, parentId) => {
      if (node.id === parentId) {
        node.children.push(newNode);
        return true;
      }
      return node.children.some(child => findAndAddNode(child, parentId));
    };
  
    if (findAndAddNode(communityTree, parentId)) {
      res.status(201).json(newNode);
    } else {
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
