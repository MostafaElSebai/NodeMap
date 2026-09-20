import { useBoardContext } from "../contexts/boardContext"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { Background, Controls, ReactFlow, Panel, MiniMap, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from "../components/CustomNode";
import CustomEdge from "../components/CustomEdge";
import CustomCombobox from "../components/CustomCombobox";
import CustomSelect from "../components/CustomSelect";

const nodeTypes = {
    customNode: CustomNode
}

const edgeTypes = {
    customEdge: CustomEdge
}

export default function BoardCanvas() {
    const { boardId } = useParams()

    const {
        handleGetBoardById, boardDataById, nodesArr, edges, onEdgesChange, onNodesChange, addConn, loading: boardLoading, deleteConn,
        handleCreateNode, handleNodeDragStop,
        handleCreateNodeType, loading: typesLoading,
        updateConn, edgeToEdit, setEdgeToEdit,
        graphSearch
    } = useBoardContext()

    const [activeTab, setActiveTab] = useState('none') // 'node' or 'type' or 'none'
    const [name, setName] = useState("")
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false)
    const [pendingConnection, setPendingConnection] = useState(null)
    const [connName, setConnName] = useState("")
    const [connType, setConnType] = useState("non-directional")

    // Search State
    const [searchStartNode, setSearchStartNode] = useState(null)
    const [searchEndNode, setSearchEndNode] = useState(null)
    const [searchError, setSearchError] = useState(null)
    const [highlightedEdgeIds, setHighlightedEdgeIds] = useState([])
    const [highlightedNodeIds, setHighlightedNodeIds] = useState(new Set())

    useEffect(() => {
        const fetchData = async (boardId) => {
            await handleGetBoardById(boardId)
        }
        fetchData(boardId)
    }, []);

    useEffect(() => {
        if (edgeToEdit) {
            setConnName(edgeToEdit.connectionName);
            setConnType(edgeToEdit.connectionType);
        } else if (pendingConnection) {
            setConnName("");
            setConnType("non-directional");
        }
    }, [edgeToEdit, pendingConnection]);

    useEffect(() => {
        setSearchError(null);
    }, [searchStartNode, searchEndNode]);

    const { nodeTypes: nodeCategories } = boardDataById || {}

    const onAddNode = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const allValues = Object.fromEntries(formData)
        if (selectedCategory) allValues.category = selectedCategory.id;
        handleCreateNode({ formData: allValues, boardId })
        setActiveTab('none')
        setSelectedCategory(null)
    }

    const onAddType = async () => {
        if (!name.trim()) return;
        await handleCreateNodeType(name, boardId)
        setName("")
        if (activeTab === 'type') {
            setActiveTab('none')
        }
        setIsTypeModalOpen(false)
    }

    const OnAddConn = async () => {
        if (!connName.trim()) return;

        if (edgeToEdit) {
            await updateConn(boardId, edgeToEdit.id, {
                connectionType: connType,
                connectionName: connName
            });
            setEdgeToEdit(null);
        } else if (pendingConnection) {
            await addConn(boardId, {
                source: pendingConnection.source,
                target: pendingConnection.target,
                connectionType: connType,
                connectionName: connName
            });
            setPendingConnection(null);
        }

        setConnName("");
        setConnType("non-directional");
    }

    // --- Search Logic ---
    const handleNodeClick = (event, node) => {
        if (activeTab === 'search') {
            const nodeData = { id: node.id, label: node.data.label, subLabel: node.category?.name };
            if (!searchStartNode) {
                setSearchStartNode(nodeData);
            } else if (!searchEndNode && searchStartNode.id !== node.id) {
                setSearchEndNode(nodeData);
            }
        }
    }

    const onSearchPath = async () => {
        if (!searchStartNode || !searchEndNode) return;
        setSearchError(null);
        const result = await graphSearch(boardId, searchStartNode.id, searchEndNode.id);
        
        console.log("Graph Search Result:", result);
        console.log("Edges in state:", edges.map(e => e.id));

        if (Array.isArray(result) && result.length > 0) {
            // result is an array of NODE IDs (the shortest path)
            setHighlightedNodeIds(new Set(result));
            
            // Extract edge IDs from the nodes path
            const edgeIds = [];
            for (let i = 0; i < result.length - 1; i++) {
                const u = result[i];
                const v = result[i + 1];
                
                // Find an edge that goes from u to v
                const pathEdge = edges.find(edge => {
                    const matchesDirect = edge.source === u && edge.target === v;
                    // For non-directional, it could be v -> u in our state
                    const matchesReverse = edge.source === v && edge.target === u && edge.data?.connectionType === 'non-directional';
                    return matchesDirect || matchesReverse;
                });
                
                if (pathEdge) {
                    edgeIds.push(pathEdge.id);
                }
            }
            setHighlightedEdgeIds(edgeIds);
        } else {
            // Nothing found, or error
            setHighlightedEdgeIds([]);
            setHighlightedNodeIds(new Set());
            setSearchError("There's no path connecting these two nodes.");
        }
    }

    const clearSearch = () => {
        setHighlightedEdgeIds([]);
        setHighlightedNodeIds(new Set());
        setSearchStartNode(null);
        setSearchEndNode(null);
        setSearchError(null);
    }

    // --- Inject Highlighting Data ---
    const displayNodes = nodesArr.map(node => {
        if (highlightedEdgeIds.length === 0) return { ...node, data: { ...node.data, isHighlighted: false, isDimmed: false } };
        const isHighlighted = highlightedNodeIds.has(node.id);
        return { ...node, data: { ...node.data, isHighlighted, isDimmed: !isHighlighted } };
    });

    const displayEdges = edges.map(edge => {
        if (highlightedEdgeIds.length === 0) return { ...edge, data: { ...edge.data, isHighlighted: false, isDimmed: false } };
        const isHighlighted = highlightedEdgeIds.includes(edge.id) || (edge.reverseId && highlightedEdgeIds.includes(edge.reverseId));
        return { ...edge, data: { ...edge.data, isHighlighted, isDimmed: !isHighlighted } };
    });

    return (

        <div className="react-flow-wrapper">
            <ReactFlow
                nodes={displayNodes}
                edges={displayEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodeClick={handleNodeClick}
                onNodeDragStop={(event, node, nodes) => handleNodeDragStop(boardId, node)}
                onConnect={(params) => setPendingConnection(params)}
                fitView
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={24}
                    size={2}
                    color="rgba(255,255,255,0.08)"
                />

                <MiniMap
                    nodeStrokeColor="rgba(255,255,255,0.1)"
                    nodeColor="rgba(44, 49, 58, 1)"
                />
                <Controls />

                {/* Left Sidebar HUD */}
                <Panel position="top-center" className="mt-24 md:mt-28 w-[calc(100vw-2rem)] sm:w-80 md:w-72 pointer-events-auto">
                    <div className="flex flex-col space-y-4">

                        {/* Control Buttons */}
                        <div className="flex bg-bg-surface border border-border-subtle rounded-md shadow-lg overflow-hidden font-mono text-sm">
                            <button
                                onClick={() => setActiveTab(activeTab === 'node' ? 'none' : 'node')}
                                className={`flex-1 py-2 text-center transition-colors border-r border-border-subtle ${activeTab === 'node' ? 'bg-accent-teal text-bg-app font-bold' : 'text-text-secondary hover:text-text-primary hover:bg-bg-app'}`}
                            >
                                + NODE
                            </button>
                            <button
                                onClick={() => setActiveTab(activeTab === 'type' ? 'none' : 'type')}
                                className={`flex-1 py-2 text-center transition-colors border-r border-border-subtle ${activeTab === 'type' ? 'bg-accent-teal text-bg-app font-bold' : 'text-text-secondary hover:text-text-primary hover:bg-bg-app'}`}
                            >
                                + TYPE
                            </button>
                            <button
                                onClick={() => setActiveTab(activeTab === 'search' ? 'none' : 'search')}
                                className={`flex flex-1 items-center justify-center space-x-1 py-2 transition-colors ${activeTab === 'search' ? 'bg-accent-teal text-bg-app font-bold' : 'text-text-secondary hover:text-text-primary hover:bg-bg-app'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <span>SEARCH</span>
                            </button>
                        </div>

                        {/* Node Creation Form */}
                        {activeTab === 'node' && (
                            <form onSubmit={onAddNode} className="bg-bg-surface border border-border-subtle rounded-md shadow-lg p-4 flex flex-col space-y-4">
                                <h3 className="font-mono text-xs text-text-secondary uppercase tracking-widest border-b border-border-subtle pb-2">New Node</h3>

                                <input
                                    type="text"
                                    placeholder="Title"
                                    name="title"
                                    required
                                    className="w-full bg-bg-app border border-border-subtle rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
                                />

                                <textarea
                                    placeholder="Description..."
                                    name="description"
                                    rows="3"
                                    className="w-full bg-bg-app border border-border-subtle rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-teal transition-colors resize-none"
                                />

                                <div className="relative z-40">
                                    <CustomSelect 
                                        name="category"
                                        items={[
                                            ...(nodeCategories || []).map(cat => ({ id: cat._id, label: cat.name })),
                                            { id: "add_new_category", label: "+ Add Node Category..." }
                                        ]}
                                        selectedItem={selectedCategory}
                                        onChange={(item) => {
                                            if (item.id === 'add_new_category') {
                                                setIsTypeModalOpen(true);
                                                setSelectedCategory(null);
                                            } else {
                                                setSelectedCategory(item);
                                            }
                                        }}
                                        placeholder="Select Category..."
                                    />
                                </div>

                                <button type="submit" className="w-full bg-accent-teal text-bg-app font-mono font-bold py-2 rounded text-sm hover:opacity-90 transition-opacity uppercase">
                                    Deploy Node
                                </button>
                            </form>
                        )}

                        {/* Node Type Creation Form */}
                        {activeTab === 'type' && (
                            <div className="bg-bg-surface border border-border-subtle rounded-md shadow-lg p-4 flex flex-col space-y-4">
                                <h3 className="font-mono text-xs text-text-secondary uppercase tracking-widest border-b border-border-subtle pb-2">New Node Type</h3>

                                <input
                                    type="text"
                                    placeholder="Type Name (e.g. Server, Lead)"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && onAddType()}
                                    className="w-full bg-bg-app border border-border-subtle rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
                                />

                                <button
                                    onClick={onAddType}
                                    disabled={typesLoading || !name.trim()}
                                    className="w-full bg-accent-teal text-bg-app font-mono font-bold py-2 rounded text-sm hover:opacity-90 transition-opacity disabled:opacity-50 uppercase"
                                >
                                    {typesLoading ? "Registering..." : "Register Type"}
                                </button>
                            </div>
                        )}

                        {/* Search Form */}
                        {activeTab === 'search' && (
                            <div className={`bg-bg-surface border border-border-subtle rounded-md shadow-lg p-4 flex flex-col space-y-4 transition-opacity duration-300 hover:opacity-100 ${highlightedEdgeIds.length > 0 ? 'opacity-30' : 'opacity-100'}`}>
                                <h3 className="font-mono text-xs text-text-secondary uppercase tracking-widest border-b border-border-subtle pb-2">Graph Search</h3>
                                <p className="text-[11px] text-text-secondary leading-tight">
                                    Click nodes on the board, or search for them below.
                                </p>

                                <div>
                                    <label className="text-[10px] uppercase font-mono text-text-secondary tracking-widest mb-1 block">Start Node</label>
                                    <CustomCombobox 
                                        items={nodesArr.map(n => ({ id: n.id, label: n.data.label, subLabel: n.data.category?.name }))}
                                        selectedItem={searchStartNode}
                                        onChange={setSearchStartNode}
                                        placeholder="Search Start..."
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase font-mono text-text-secondary tracking-widest mb-1 block">End Node</label>
                                    <CustomCombobox 
                                        items={nodesArr.map(n => ({ id: n.id, label: n.data.label, subLabel: n.data.category?.name }))}
                                        selectedItem={searchEndNode}
                                        onChange={setSearchEndNode}
                                        placeholder="Search End..."
                                    />
                                </div>

                                <button
                                    onClick={onSearchPath}
                                    disabled={!searchStartNode || !searchEndNode || boardLoading}
                                    className="w-full bg-accent-teal text-bg-app font-mono font-bold py-2 rounded text-sm hover:opacity-90 transition-opacity disabled:opacity-50 uppercase flex items-center justify-center space-x-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    <span>{boardLoading ? "Searching..." : "Search Path"}</span>
                                </button>
                                
                                {searchError && (
                                    <div className="p-2 bg-red-900/20 border border-red-500/50 rounded text-red-400 text-[11px] font-mono text-center">
                                        {searchError}
                                    </div>
                                )}

                                {highlightedEdgeIds.length > 0 && (
                                    <button
                                        onClick={clearSearch}
                                        className="w-full bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500/30 font-mono font-bold py-2 rounded text-sm transition-all uppercase flex items-center justify-center space-x-2"
                                    >
                                        <span>Clear Path</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </Panel>

            </ReactFlow>

            {/* Floating Node Type Modal */}
            {isTypeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
                    <div className="bg-bg-surface border border-border-subtle rounded-md shadow-xl p-6 flex flex-col space-y-4 w-96 relative">
                        <button
                            onClick={() => setIsTypeModalOpen(false)}
                            className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
                        >
                            ✕
                        </button>
                        <h3 className="font-mono text-sm text-text-secondary uppercase tracking-widest border-b border-border-subtle pb-2">New Node Type</h3>

                        <input
                            type="text"
                            placeholder="Type Name (e.g. Server, Lead)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onAddType()}
                            autoFocus
                            className="w-full bg-bg-app border border-border-subtle rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
                        />

                        <button
                            onClick={onAddType}
                            disabled={typesLoading || !name.trim()}
                            className="w-full bg-accent-teal text-bg-app font-mono font-bold py-2 rounded text-sm hover:opacity-90 transition-opacity disabled:opacity-50 uppercase"
                        >
                            {typesLoading ? "Registering..." : "Register Type"}
                        </button>
                    </div>
                </div>
            )}

            {/* Connection Creation / Update Modal */}
            {(pendingConnection || edgeToEdit) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
                    <div className="bg-bg-surface border border-border-subtle rounded-md shadow-xl p-6 flex flex-col space-y-4 w-96 relative">
                        <button
                            onClick={() => {
                                setPendingConnection(null);
                                setEdgeToEdit(null);
                                setConnName("");
                                setConnType("non-directional");
                            }}
                            className="absolute top-4 right-4 text-text-secondary hover:text-text-primary"
                        >
                            ✕
                        </button>
                        <h3 className="font-mono text-sm text-text-secondary uppercase tracking-widest border-b border-border-subtle pb-2">{edgeToEdit ? 'Edit Connection' : 'New Connection'}</h3>

                        <input
                            type="text"
                            placeholder="Connection Name (e.g. Authenticates)"
                            value={connName}
                            onChange={(e) => setConnName(e.target.value)}
                            autoFocus
                            className="w-full bg-bg-app border border-border-subtle rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
                        />

                        <div className="relative z-40">
                            <CustomSelect 
                                name="connType"
                                items={[
                                    { id: 'non-directional', label: 'Non-directional' },
                                    { id: 'directional', label: 'Directional' }
                                ]}
                                selectedItem={{ id: connType, label: connType === 'directional' ? 'Directional' : 'Non-directional' }}
                                onChange={(item) => setConnType(item.id)}
                            />
                        </div>

                        <button
                            onClick={OnAddConn}
                            disabled={!connName.trim() || boardLoading}
                            className="w-full bg-accent-teal text-bg-app font-mono font-bold py-2 rounded text-sm hover:opacity-90 transition-opacity disabled:opacity-50 uppercase"
                        >
                            {boardLoading ? "Saving..." : (edgeToEdit ? "Save Changes" : "Create Connection")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}