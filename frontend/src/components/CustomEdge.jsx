import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from '@xyflow/react';
import { useState } from 'react';
import { useBoardContext } from '../contexts/boardContext';


const ArrowLeft = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path>
    </svg>
)
const ArrowRight = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>
    </svg>
)
const ArrowUp = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path>
    </svg>
)
const ArrowDown = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path>
    </svg>
)

export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
}) {
    const context = useBoardContext();
    const deleteConn = context?.deleteConn;
    const boardDataById = context?.boardDataById;
    const setEdgeToEdit = context?.setEdgeToEdit;
    
    const boardId = boardDataById?.board?._id;

    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const [isHovered, setIsHovered] = useState(false);

    const handleDelete = (e) => {
        e.stopPropagation();
        if (boardId && id) {
            deleteConn(boardId, id);
        }
    };

    const handleOptions = (e) => {
        e.stopPropagation();
        setEdgeToEdit({
            id,
            connectionName: data?.label || "",
            connectionType: data?.connectionType || "non-directional"
        });
    };

    const handleDoubleClick = (e) => {
        if (context) {
            e.stopPropagation();
            setEdgeToEdit({
                id,
                connectionName: data?.label || "",
                connectionType: data?.connectionType || "non-directional"
            });
        }
    };

    const isBiDirectional = data?.connectionType === 'non-directional';
    
    // Determine overall flow direction based on nodes' relative positions
    const dx = Math.abs(targetX - sourceX);
    const dy = Math.abs(targetY - sourceY);
    const isOverallHorizontal = dx > dy;
    
    const isTargetDown = targetY > sourceY;
    const isTargetRight = targetX > sourceX;

    const { isHighlighted, isDimmed } = data || {};

    const activeClass = (isHovered || isHighlighted) ? "text-accent-teal brightness-[1.3]" : "text-text-secondary brightness-[1.3]";

    let IconStart = null;
    let IconEnd = null;

    if (isBiDirectional) {
        if (isOverallHorizontal) {
            IconStart = <ArrowLeft className={activeClass} />;
            IconEnd = <ArrowRight className={activeClass} />;
        } else {
            IconStart = <ArrowUp className={activeClass} />;
            IconEnd = <ArrowDown className={activeClass} />;
        }
    } else {
        // Directional
        if (isOverallHorizontal) {
            if (isTargetRight) {
                IconEnd = <ArrowRight className={activeClass} />;
            } else {
                IconStart = <ArrowLeft className={activeClass} />;
            }
        } else {
            if (isTargetDown) {
                IconEnd = <ArrowDown className={activeClass} />;
            } else {
                IconStart = <ArrowUp className={activeClass} />;
            }
        }
    }

    return (
        <g className={`transition-opacity duration-300 ${isDimmed ? 'opacity-30' : 'opacity-100'}`}>
            <BaseEdge
                path={edgePath}
                style={{
                    ...style,
                    stroke: (isHovered || isHighlighted) ? '#4A8B9A' : 'rgba(255,255,255,0.2)', // Accent teal
                    strokeWidth: (isHovered || isHighlighted) ? 3 : 2,
                    transition: 'stroke 0.3s ease, stroke-width 0.3s ease'
                }}
            />
            {/* An invisible wider path to make hovering easier */}
            <path
                d={edgePath}
                fill="none"
                strokeOpacity={0}
                strokeWidth={20}
                className="react-flow__edge-interaction"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onDoubleClick={handleDoubleClick}
                style={{ cursor: 'pointer' }}
            />
            

            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                    className={`nodrag nopan transition-opacity duration-300 ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onDoubleClick={handleDoubleClick}
                >
                    <div className={`flex flex-col items-center bg-bg-surface border overflow-hidden transition-all duration-300 ease-in-out ${(isHovered || isHighlighted) ? 'shadow-[0_0_15px_rgba(74,139,154,0.5)] border-accent-teal rounded-md z-50' : 'border-border-subtle rounded-[14px]'}`}>
                        {isOverallHorizontal ? (
                            <div className={`px-3 flex items-center justify-center space-x-3 font-mono text-[10px] uppercase text-text-primary whitespace-nowrap font-bold tracking-widest transition-all duration-300 ${(isHovered || isHighlighted) ? 'py-1.5' : 'py-1'}`}>
                                {IconStart && <div className="flex items-center justify-center -mt-[1px]">{IconStart}</div>}
                                <span className="leading-none">{data?.label || "Connection"}</span>
                                {IconEnd && <div className="flex items-center justify-center -mt-[1px]">{IconEnd}</div>}
                            </div>
                        ) : (
                            <div className={`px-3 flex flex-col items-center justify-center space-y-1.5 font-mono text-[10px] uppercase text-text-primary whitespace-nowrap font-bold tracking-widest transition-all duration-300 ${(isHovered || isHighlighted) ? 'py-2' : 'py-1.5'}`}>
                                {IconStart && <div className="flex items-center justify-center">{IconStart}</div>}
                                <span className="leading-none">{data?.label || "Connection"}</span>
                                {IconEnd && <div className="flex items-center justify-center">{IconEnd}</div>}
                            </div>
                        )}

                        {/* Smooth expanding container using CSS grid */}
                        <div className={`grid transition-all duration-300 ease-in-out w-full ${isHovered ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                            <div className="overflow-hidden flex flex-col w-full">
                                <div className="flex border-t border-border-subtle w-full mt-auto">
                                    {context && (
                                        <>
                                            <button
                                                onClick={handleOptions}
                                                className="flex-1 py-1 flex items-center justify-center text-text-secondary hover:text-accent-teal transition-colors border-r border-border-subtle hover:bg-bg-app rounded-bl-md"
                                                title="Options"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="flex-1 py-1 flex items-center justify-center text-text-secondary hover:text-red-500 transition-colors hover:bg-bg-app rounded-br-md"
                                                title="Delete Connection"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </EdgeLabelRenderer>
        </g>
    );
}
