const pool = require("../db");

const getAllNodes = async () => {
    const { rows } = await pool.query("SELECT * FROM tree_nodes");
    
    const nodeMap = {};
    rows.forEach(node => nodeMap[node.id] = { ...node, children: [] });

    const rootNodes = [];
    rows.forEach(node => {
        if (node.parent_id === null) {
            rootNodes.push(nodeMap[node.id]);
        } else {
            nodeMap[node.parent_id]?.children.push(nodeMap[node.id]);
        }
    });

    return rootNodes;
};

const getNodeById = async (id) => {
    const { rows } = await pool.query("SELECT * FROM tree_nodes WHERE id = $1", [id]);
    return rows[0] || null;
};

const createNode = async (name, parentId) => {
    const { rows } = await pool.query(
        "INSERT INTO tree_nodes (name, parent_id) VALUES ($1, $2) RETURNING *",
        [name, parentId]
    );
    return rows[0];
};

const updateNode = async (id, name) => {
    const { rows } = await pool.query(
        "UPDATE tree_nodes SET name = $1 WHERE id = $2 RETURNING *",
        [name, id]
    );
    return rows.length > 0 ? rows[0] : null;
};

const deleteNode = async (id) => {
    await pool.query("DELETE FROM tree_nodes WHERE id = $1", [id]);
};

module.exports = { getAllNodes, getNodeById, createNode, updateNode, deleteNode };
