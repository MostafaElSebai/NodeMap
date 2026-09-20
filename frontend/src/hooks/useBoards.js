import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { getAllBoards, createBoard, getBoardById, createConn, deleteConnection, updateConnection, graphSearch as graphSearchAPI } from "../APIs/boards";
import { filterDupEdges } from "../utils/filterDupEdges";
import { formatNodeData, formatEdgeData } from "../utils/flowFormatters";
import toast from "react-hot-toast";
import { applyEdgeChanges, applyNodeChanges } from "@xyflow/react";

export default function useBoards() {
    // --- STATE DEFINITIONS ---
    const [loading, setLoading] = useState(false);
    const [boards, setBoards] = useState([]);
    const [nodesArr, setNodesArr] = useState([]);
    const [edges, setEdges] = useState([]);
    const [boardDataById, setBoardDataById] = useState(null);
    const [edgeToEdit, setEdgeToEdit] = useState(null);
    const navigate = useNavigate();

    // --- BOARD INTERACTIVITY ---
    const onNodesChange = useCallback(
        (changes) => setNodesArr((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );

    // --- API HANDLERS ---

    // Fetch all boards
    const getBoards = async () => {
        try {
            setLoading(true);
            const data = await getAllBoards();
            setBoards(data);
            setLoading(false);
            return data;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.msg || "Something went wrong");
            setLoading(false);
            return error?.response?.data?.msg;
        }
    };

    // Add a new board
    const addBoard = async (name) => {
        try {
            setLoading(true);
            const board = await createBoard(name);
            setBoards(prev => [...prev, board]);
            setLoading(false);
            navigate(`/boards/${board._id}`);
            return board;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.msg || "Something went wrong");
            setLoading(false);
            return error?.response?.data?.msg;
        }
    };

    // Fetch a single board by ID and format its nodes/edges for React Flow
    const handleGetBoardById = async (boardId) => {
        try {
            setLoading(true);
            const data = await getBoardById(boardId);

            // Format nodes and edges using our separated utility functions
            const formattedNodes = data.nodes.map(formatNodeData);
            const formattedEdges = data.connections.map(formatEdgeData);

            // Note: We use the raw fetched data for setBoardDataById, 
            // but use the formatted arrays for nodesArr and edges
            setBoardDataById(data);
            setNodesArr(formattedNodes);
            setEdges(filterDupEdges(formattedEdges));

            setLoading(false);
            return data;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.msg || "Something went wrong");
            setLoading(false);
            return error?.response?.data?.msg;
        }
    };

    // Add a connection (edge) between nodes
    const addConn = async (boardId, params) => {
        try {
            setLoading(true);
            const conn = {
                source: params.source,
                target: params.target,
                connectionType: params.connectionType,
                connectionName: params.connectionName
            };

            const createdEdge = await createConn(boardId, conn);

            // Format the newly created edge before adding it to state
            const formattedEdge = formatEdgeData(createdEdge);
            setEdges(prev => [...prev, formattedEdge]);

            setLoading(false);
            return edges;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.msg || "Something went wrong");
            setLoading(false);
            return error?.response?.data?.msg;
        }
    };

    const deleteConn = async (boardId, connId) => {
        try {
            setLoading(true);
            await deleteConnection(boardId, connId);
            setEdges(prev => prev.filter(edge => edge.id !== connId));
            setLoading(false);
            return edges;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.msg || "Something went wrong");
            setLoading(false);
            return error?.response?.data?.msg;
        }
    }

    const updateConn = async (boardId, connId, conn) => {
        try {
            setLoading(true);
            const updatedEdge = await updateConnection(boardId, connId, conn);
            const formattedEdge = formatEdgeData(updatedEdge);
            setEdges(prev => prev.map(edge => edge.id === connId ? formattedEdge : edge));
            setLoading(false);
            return edges;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.msg || "Something went wrong");
            setLoading(false);
            return error?.response?.data?.msg;
        }
    }

    const graphSearch = async (boardId, startNodeId, endNodeId) => {
        try {
            setLoading(true);
            const result = await graphSearchAPI(boardId, startNodeId, endNodeId);
            setLoading(false);
            return result;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.msg || "Something went wrong");
            setLoading(false);
            return error?.response?.data?.msg;
        }
    }

    // --- RETURN PAYLOAD ---
    // Returns everything needed by the context provider
    return {
        getBoards,
        addBoard,
        graphSearch,
        loading,
        boards,
        handleGetBoardById,
        boardDataById,
        setBoardDataById,
        nodesArr,
        setNodesArr,
        edges,
        setEdges,
        onEdgesChange,
        onNodesChange,
        addConn,
        deleteConn,
        updateConn,
        edgeToEdit,
        setEdgeToEdit
    };
}
