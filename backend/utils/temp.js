export const shortestPath = (data, startNode, endNode) => {
    const connections = data[0].data
    const endNodeObjectId = new mongoose.Types.ObjectId(endNode);
    let connections = []

    for (const node of nodes) {
        if (node._id.equals(startNodeObjectId)) {
            // If the start node is found, initialize the queue and visited set
            queue.push({
                node: node._id,
                path: [node],
                distances: { [node._id.toString()]: 0 },
                step: { [node._id.toString()]: 0 },
            });
            visited.add(node._id.toString());
        }

        // Process nodes in the queue
        while (queue.length > 0) {
            const { node: currentNodeId, path: currentPath, distances: currentDistances, step: currentStep } = queue.shift();

            // Get the outgoing connections for the current node
            const outgoingConnections = connections.filter((conn) =>
                conn.parentNode.equals(currentNodeId)
            );

            // Process each outgoing connection
            for (const connection of outgoingConnections) {
                const childNodeId = connection.childNode;

                // Skip if the child node has already been visited
                if (visited.has(childNodeId.toString())) {
                    continue;
                }

                // Mark the child node as visited
                visited.add(childNodeId.toString());

                // Calculate new distance and step
                const newDistance = currentDistances[currentNodeId.toString()] + 1;
                const newStep = currentStep[currentNodeId.toString()] + 1;

                // Update distances and step records
                currentDistances[childNodeId.toString()] = newDistance;
                currentStep[childNodeId.toString()] = newStep;

                // Create new path by appending the child node
                const newPath = [...currentPath, nodes.find((n) => n._id.equals(childNodeId))];

                // Check if the end node is reached
                if (childNodeId.equals(endNodeObjectId)) {
                    // Format the result with both distance and step
                    return {
                        distance: newDistance,
                        step: newStep,
                        nodes: newPath,
                    };
                }

                // Add the child node to the queue for further exploration
                queue.push({
                    node: childNodeId,
                    path: newPath,
                    distances: currentDistances,
                    step: currentStep,
                });
            }
        }
    }

    return { distance: -1, step: -1, nodes: [] };
}