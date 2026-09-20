export function filterDupEdges(edges) {
    const seenEdges = new Map();
    const uniqueEdges = [];
    for (const edge of edges) {
        if (!edge.groupId) {
            uniqueEdges.push(edge)
            continue
        }
        const edgeSignature = edge.groupId;
        if (seenEdges.has(edgeSignature)) {
            const firstEdge = seenEdges.get(edgeSignature);
            
            if (edge._id < firstEdge._id) {
                // edge is the main node (created earlier)
                edge.reverseId = firstEdge._id;
                seenEdges.set(edgeSignature, edge);
                
                // Replace the reverse node in uniqueEdges with the main node
                const index = uniqueEdges.findIndex(e => e._id === firstEdge._id);
                if (index !== -1) uniqueEdges[index] = edge;
            } else {
                // firstEdge is already the main node
                firstEdge.reverseId = edge._id;
            }
            continue;
        }
        seenEdges.set(edgeSignature, edge);
        uniqueEdges.push(edge);
    }
    return uniqueEdges;
}