import { createNode, updateNode, updateNodePosition } from "../APIs/nodes"
import { useState } from "react"
import toast from "react-hot-toast"
import { formatNodeData } from "../utils/flowFormatters";

export default function useNodes({ setNodesArr }) {

    const [loading, setLoading] = useState(false)

    const handleCreateNode = async ({ formData, boardId }) => {
        try {
            setLoading(true)

            const node = await createNode({ data: formData, boardId })

            const formattedNode = formatNodeData(node)

            setNodesArr((prev) => [...prev, formattedNode])
            setLoading(false)
            return node
        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong")
            setLoading(false)
            return error?.response?.data?.msg

        }
    }

    const handleNodeDragStop = async (boardId, node) => {

        try {
            setLoading(true)


            // Only send position on drag stop, relying on the backend's PATCH behavior
            const updatedNode = await updateNodePosition(boardId, node.id, { position: node.position });

            const formattedNode = formatNodeData(updatedNode)

            setNodesArr(prev => prev.map((n) => n.id === node.id ? formattedNode : n))


            setLoading(false)

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.msg || "Something went wrong")
            setLoading(false)
            return error?.response?.data?.msg

        }
    }
    const handleUpdateNodeData = async (boardId, nodeId, updatePayload) => {
        try {
            setLoading(true)

            const updatedNode = await updateNode(boardId, nodeId, updatePayload);

            const formattedNode = formatNodeData(updatedNode)

            setNodesArr(prev => prev.map((n) => n.id === nodeId ? formattedNode : n))

            setLoading(false)
            return updatedNode

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.msg || "Something went wrong")
            setLoading(false)
            return error?.response?.data?.msg
        }
    }

    return { handleCreateNode, handleNodeDragStop, handleUpdateNodeData, loading };
}
