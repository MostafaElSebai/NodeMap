import apiClient from "./apiClient";

export const createNodeType = async ({ name }, boardId) => {
    const response = await apiClient.post(`boards/${boardId}/nodesTypes`, { name });
    return response.data
}

export const getNodeTypes = async (boardId) => {
    const response = await apiClient.get(`boards/${boardId}/nodesTypes`);
    return response.data
}

export const deleteNodeType = async (nodeTypeId, boardId) => {
    const response = await apiClient.delete(`boards/${boardId}/nodesTypes/${nodeTypeId}`);
    return response.data
}   