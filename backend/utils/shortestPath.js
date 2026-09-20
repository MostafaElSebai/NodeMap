export const shortestPath = (data, startNode, endNode) => {

    if (!data || !data[0].data || data.length === 0) return null;

    const graph = {};
    const queue = [[startNode]];
    const visited = new Set()
    visited.add(startNode)
    const connections = data[0].data


    connections.forEach(conn => {
        const parent = conn.source.toString()
        const child = conn.target.toString()

        if (!Object.hasOwn(graph, parent)) {
            graph[parent] = [child]

        } else {
            graph[parent].push(child)
        }
    });

    let iteration = 0;
    while (queue.length > 0) {
        console.log(`Current iteration: ${iteration}`);

        const pathArr = queue.shift();
        const currentMainNode = pathArr.at(-1)

        if (currentMainNode === endNode) {

            return pathArr
        }

        const nieghbors = graph[currentMainNode] || []

        nieghbors.forEach(node => {
            if (!visited.has(node)) {
                const latestArr = [...pathArr, node]
                queue.push(latestArr)
                visited.add(node)

            }
        })
        iteration++

    }
    return null;
}