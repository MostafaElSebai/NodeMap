import apiClient from "./apiClient";

export const createNodeType = async (name, boardId) => {
    const response = await apiClient.post(`boards/${boardId}/nodesTypes`, { name });
    return response.data
}


export const createNode = async ({ data, boardId }) => {
    data.position = { x: 0, y: 0 };
    const response = await apiClient.post(`boards/${boardId}/nodes`, data);
    return response.data
}

export const updateNode = async (boardId, nodeId, data) => {
    const response = await apiClient.patch(`boards/${boardId}/nodes/${nodeId}`, data);
    return response.data
}

export const updateNodePosition = async (boardId, nodeId, data) => {
    const response = await apiClient.patch(`boards/${boardId}/nodes/${nodeId}/position`, data);
    return response.data
}