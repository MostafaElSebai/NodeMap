import { createNodeType, deleteNodeType } from "../APIs/nodeTypes"
import { useState } from "react"
import toast from "react-hot-toast"

export default function useNodeTypes({ setBoardDataById }) {
    const [loading, setLoading] = useState(false)
    const [nodeTypes, setNodeTypes] = useState([]);


    // const handleGetNodeTypes = async (boardId) => {
    //     try {
    //         setLoading(true)
    //         const nodeTypesData = await getNodeTypes(boardId)
    //         setNodeTypes(nodeTypesData.nodeTypes)
    //         setLoading(false)
    //         return nodeTypesData
    //     } catch (error) {
    //         toast.error(error.response?.data?.msg || "Something went wrong")
    //         setLoading(false)
    //         return error?.response?.data?.msg

    //     }
    // }

    const handleCreateNodeType = async (name, boardId) => {
        try {
            setLoading(true)
            const nodeType = await createNodeType({ name }, boardId)

            setBoardDataById((prev) => ({ ...prev, nodeTypes: [...prev.nodeTypes, nodeType] }))

            setLoading(false)
            return nodeType;
        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong")
            setLoading(false)
            return error?.response?.data?.msg

        }
    }

    const handleNodeTypeDelete = async (nodeTypeId, boardId) => {
        try {
            setLoading(true)
            await deleteNodeType(nodeTypeId, boardId)
            setBoardDataById((prev) => ({ ...prev, nodeTypes: prev.nodeTypes.filter((nodeType) => nodeType._id !== nodeTypeId) }))
            setLoading(false)
        } catch (error) {
            toast.error(error.response?.data?.msg || "Something went wrong")
            setLoading(false)
            return error?.response?.data?.msg
        }
    }


    return { handleCreateNodeType, nodeTypes, loading };
}
