import React, { useEffect, useState } from 'react';
import { ReactFlow, Background, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from "./CustomNode";
import CustomEdge from "./CustomEdge";
import { getBoardById } from "../APIs/boards";
import { formatEdgeData, formatNodeData } from "../utils/flowFormatters";
import { filterDupEdges } from "../utils/filterDupEdges";

const nodeTypes = {
    customNode: CustomNode
};
const edgeTypes = {
    customEdge: CustomEdge
};

export default function BoardPreview({ boardId }) {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchBoard = async () => {
            try {
                const { nodes, connections } = await getBoardById(boardId);
                if (!isMounted) return;

                const formattedNodes = nodes.map(formatNodeData);
                const uniqueEdges = filterDupEdges(connections);
                const formattedEdges = uniqueEdges.map(formatEdgeData);

                setNodes(formattedNodes);
                setEdges(formattedEdges);
            } catch (error) {
                console.error("Failed to load preview for board", boardId, error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchBoard();
        return () => { isMounted = false; };
    }, [boardId]);

    if (loading) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-bg-app relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:12px_12px]"></div>
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-6 h-6 border-2 border-accent-teal border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span className="text-text-secondary font-mono text-[10px] tracking-widest uppercase">Loading Preview</span>
                </div>
            </div>
        );
    }

    if (nodes.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-bg-app relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:12px_12px]"></div>
                <div className="w-10 h-10 border border-dashed border-border-subtle rounded flex items-center justify-center z-10 bg-bg-surface/50 group-hover:border-accent-teal transition-colors">
                    <span className="text-text-secondary font-mono text-[10px] group-hover:text-accent-teal">EMPTY</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-bg-app pointer-events-none">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.1}
                proOptions={{ hideAttribution: true }}
                panOnDrag={false}
                zoomOnScroll={false}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
            >
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="rgba(255,255,255,0.05)" />
            </ReactFlow>
        </div>
    );
}
