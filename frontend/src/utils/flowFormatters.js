// Util file to format node and edge data to match React Flow's expected structure
// We separate these to keep the main logic clean and to reuse these formatters if needed elsewhere.

/**
 * Formats backend node data into a structure suitable for React Flow.
 * Specifically maps _id to id, and moves title into the data object.
 */
export const formatNodeData = (node) => {
    // Using object spread to avoid mutating the original backend response directly
    const formattedNode = { ...node, id: node._id };

    // Pass everything the custom node needs into the data object
    formattedNode.data = {
        label: node.title,
        title: node.title,
        description: node.description,
        category: node.category
    };

    // Explicitly tell React Flow to use our CustomNode component
    formattedNode.type = 'customNode';

    delete formattedNode.title;
    delete formattedNode.description;
    return formattedNode;
};

/**
 * Formats backend connection data into a structure suitable for React Flow.
 * Specifically maps _id to id, adds edge type, and maps connectionName to label.
 */
export const formatEdgeData = (connection) => {
    // Using object spread to avoid mutating the original backend response directly
    const formattedConnection = { ...connection, id: connection._id };
    formattedConnection.type = "customEdge";
    formattedConnection.data = { 
        label: connection.connectionName,
        connectionType: connection.connectionType
    };
    delete formattedConnection.connectionName;
    return formattedConnection;
};
