import apiClient from "./apiClient"

export const getAllBoards = async () => {
    const response = await apiClient.get('/boards');
    return response.data
}
export const createBoard = async (name) => {
    const response = await apiClient.post('/boards', { name });
    return response.data
}

export const getBoardById = async (boardId) => {
    const response = await apiClient.get(`/boards/${boardId}`);
    return response.data
}

export const createConn = async (boardId, conn) => {

    const response = await apiClient.post(`/boards/${boardId}/connections`, conn);
    return response.data
}

export const deleteConnection = async (boardId, connId) => {
    const response = await apiClient.delete(`/boards/${boardId}/connections/${connId}`);
    return response.data
}


export const updateConnection = async (boardId, connId, conn) => {
    const response = await apiClient.patch(`/boards/${boardId}/connections/${connId}`, conn);
    return response.data
}

export const graphSearch = async (boardId, startNodeId, endNodeId) => {
    const response = await apiClient.get(`/boards/${boardId}/graph-lookup?startNodeId=${startNodeId}&endNodeId=${endNodeId}`);
    return response.data
}