import React, { useState } from 'react';
import { Background, ReactFlow, Panel, BackgroundVariant, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from "./CustomNode";
import CustomEdge from "./CustomEdge";
import CustomSelect from "./CustomSelect";

const nodeTypes = {
    customNode: CustomNode
};
const edgeTypes = {
    customEdge: CustomEdge
};

const initialNodes = [
    { id: 'anchor', type: 'default', position: { x: -900, y: 400 }, data: { label: '' }, style: { opacity: 0, pointerEvents: 'none', border: 'none', background: 'transparent' } },
    { id: '1', type: 'customNode', position: { x: 300, y: 500 }, data: { label: 'User', title: 'User', description: 'End User Client', category: { name: 'Client' } } },
    { id: '2', type: 'customNode', position: { x: 550, y: 300 }, data: { label: 'API Gateway', title: 'API Gateway', description: 'Routes incoming traffic', category: { name: 'Service' } } },
    { id: '3', type: 'customNode', position: { x: 900, y: 150 }, data: { label: 'Auth Service', title: 'Auth Service', description: 'Handles JWT authentication', category: { name: 'Service' } } },
    { id: '4', type: 'customNode', position: { x: 600, y: 650 }, data: { label: 'Database', title: 'Database', description: 'Primary MongoDB instance', category: { name: 'Storage' } } },
    { id: '5', type: 'customNode', position: { x: 1050, y: 550 }, data: { label: 'Redis Cache', title: 'Redis Cache', description: 'In-memory caching layer', category: { name: 'Storage' } } },
];

const initialEdges = [
    { id: 'e1-2', type: 'customEdge', source: '1', target: '2', data: { label: 'Requests', connectionType: 'directional' } },
    { id: 'e2-3', type: 'customEdge', source: '2', target: '3', data: { label: 'Validates', connectionType: 'directional' } },
    { id: 'e2-4', type: 'customEdge', source: '2', target: '4', data: { label: 'Queries', connectionType: 'directional' } },
    { id: 'e4-5', type: 'customEdge', source: '4', target: '5', data: { label: 'Syncs', connectionType: 'non-directional' } },
];

export default function DemoCanvas({ isCentered = false }) {
    const [nodes, setNodes] = useState(isCentered ? initialNodes.filter(n => n.id !== 'anchor') : initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    // Modal state
    const [nodeToEdit, setNodeToEdit] = useState(null);
    const [nodeName, setNodeName] = useState("");

    const [edgeToEdit, setEdgeToEdit] = useState(null);
    const [edgeName, setEdgeName] = useState("");
    const [edgeType, setEdgeType] = useState("directional");

    const onNodesChange = (changes) => setNodes((nds) => applyNodeChanges(changes, nds));
    const onEdgesChange = (changes) => setEdges((eds) => applyEdgeChanges(changes, eds));

    const handleNodeDoubleClick = (e, node) => {
        setNodeToEdit(node);
        setNodeName(node.data.title);
    };

    const handleEdgeDoubleClick = (e, edge) => {
        setEdgeToEdit(edge);
        setEdgeName(edge.data.label);
        setEdgeType(edge.data.connectionType);
    };

    const saveNode = () => {
        if (!nodeName.trim() || !nodeToEdit) return;
        setNodes(nds => nds.map(n => {
            if (n.id === nodeToEdit.id) {
                return { ...n, data: { ...n.data, title: nodeName, label: nodeName } };
            }
            return n;
        }));
        setNodeToEdit(null);
    };

    const saveEdge = () => {
        if (!edgeName.trim() || !edgeToEdit) return;
        setEdges(eds => eds.map(e => {
            if (e.id === edgeToEdit.id) {
                return { ...e, data: { ...e.data, label: edgeName, connectionType: edgeType } };
            }
            return e;
        }));
        setEdgeToEdit(null);
    };

    return (
        <div className="absolute inset-0">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodeDoubleClick={handleNodeDoubleClick}
                onEdgeDoubleClick={handleEdgeDoubleClick}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.1}
                className="bg-transparent w-full h-full"
                proOptions={{ hideAttribution: true }}
            >
                <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="rgba(255, 255, 255, 0.4)" />
                <Panel position="bottom-right" className="mb-10 mr-8 lg:mr-16 pointer-events-none flex items-center justify-center">
                    <div className="flex items-center gap-3 bg-bg-app/80 backdrop-blur-md border border-accent-teal/30 px-6 py-2.5 rounded-full shadow-[0_0_20px_rgba(74,139,154,0.15)] animate-bounce">
                        <svg className="w-5 h-5 text-accent-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                        <span className="text-sm font-medium text-text-primary tracking-wide">Double-click any node to edit</span>
                    </div>
                </Panel>
            </ReactFlow>

            {/* Node Edit Modal */}
            {nodeToEdit && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto rounded-md">
                    <div className="bg-bg-surface border border-border-subtle rounded-md shadow-xl p-6 flex flex-col space-y-4 w-80 relative">
                        <button onClick={() => setNodeToEdit(null)} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary">✕</button>
                        <h3 className="font-mono text-sm text-text-secondary uppercase tracking-widest border-b border-border-subtle pb-2">Edit Node</h3>
                        <input
                            type="text"
                            value={nodeName}
                            onChange={(e) => setNodeName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveNode()}
                            autoFocus
                            className="w-full bg-bg-app border border-border-subtle rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
                        />
                        <button onClick={saveNode} disabled={!nodeName.trim()} className="w-full bg-accent-teal text-bg-app font-mono font-bold py-2 rounded text-sm hover:opacity-90 transition-opacity disabled:opacity-50 uppercase">Save</button>
                    </div>
                </div>
            )}

            {/* Edge Edit Modal */}
            {edgeToEdit && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto rounded-md">
                    <div className="bg-bg-surface border border-border-subtle rounded-md shadow-xl p-6 flex flex-col space-y-4 w-80 relative">
                        <button onClick={() => setEdgeToEdit(null)} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary">✕</button>
                        <h3 className="font-mono text-sm text-text-secondary uppercase tracking-widest border-b border-border-subtle pb-2">Edit Connection</h3>
                        <input
                            type="text"
                            value={edgeName}
                            onChange={(e) => setEdgeName(e.target.value)}
                            autoFocus
                            className="w-full bg-bg-app border border-border-subtle rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
                        />
                        <div className="relative z-40">
                            <CustomSelect
                                name="connType"
                                items={[{ id: 'directional', label: 'Directional' }, { id: 'non-directional', label: 'Non-Directional' }]}
                                selectedItem={{ id: edgeType, label: edgeType === 'directional' ? 'Directional' : 'Non-Directional' }}
                                onChange={(selected) => setEdgeType(selected.id)}
                            />
                        </div>
                        <button onClick={saveEdge} disabled={!edgeName.trim()} className="w-full bg-accent-teal text-bg-app font-mono font-bold py-2 rounded text-sm hover:opacity-90 transition-opacity disabled:opacity-50 uppercase mt-4">Save</button>
                    </div>
                </div>
            )}
        </div>
    );
}
