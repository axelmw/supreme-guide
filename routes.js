const express = require("express");
const router = express.Router();
const { getAllNodes, getNodeById, createNode, updateNode, deleteNode } = require("./models/treeModel");

router.get("/tree", async (req, res) => {
    try {
        const nodes = await getAllNodes();
        res.json(nodes);
    } catch (error) {
        console.error("Error fetching tree nodes:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/tree/:id", async (req, res) => {
    try {
        const node = await getNodeById(req.params.id);
        if (!node) return res.status(404).json({ message: "Node not found" });
        res.json(node);
    } catch (error) {
        console.error("Error fetching node:", error);
        res.status(500).json({ message: "Database error" });
    }
});

router.post("/tree", async (req, res) => {
    try {
        const newNode = await createNode(req.body.name, req.body.parentId);
        res.status(201).json(newNode);
    } catch (error) {
        console.error("Error inserting node:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put("/tree/:id", async (req, res) => {
    try {
        const updatedNode = await updateNode(req.params.id, req.body.name);
        if (!updatedNode) return res.status(404).json({ message: "Node not found" });
        res.json(updatedNode);
    } catch (error) {
        console.error("Error updating node:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete("/tree/:id", async (req, res) => {
    try {
        await deleteNode(req.params.id);
        res.json({ message: "Node deleted" });
    } catch (error) {
        console.error("Error deleting node:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
