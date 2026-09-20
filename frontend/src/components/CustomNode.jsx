import { Handle, Position } from '@xyflow/react';
import { useState, useEffect } from 'react';
import { useBoardContext } from '../contexts/boardContext';
import CustomSelect from './CustomSelect';

export default function CustomNode({ id, data }) {
    const context = useBoardContext();
    
    // Safely destructure with fallbacks for when used outside a BoardProvider (like in DemoCanvas)
    const boardDataById = context?.boardDataById;
    const handleUpdateNodeData = context?.handleUpdateNodeData;
    const handleCreateNodeType = context?.handleCreateNodeType;

    const boardId = boardDataById?.board?._id;
    const nodeCategories = boardDataById?.nodeTypes || [];

    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [title, setTitle] = useState(data.title || "");
    const [description, setDescription] = useState(data.description || "");
    const [categoryId, setCategoryId] = useState(data.category?._id || "");

    const [isCreatingType, setIsCreatingType] = useState(false);
    const [newTypeName, setNewTypeName] = useState("");

    // Reset local state when data changes (e.g. from backend sync)
    useEffect(() => {
        setTitle(data.title || "");
        setDescription(data.description || "");
        setCategoryId(data.category?._id || "");
    }, [data]);

    const handleSave = async () => {
        const payload = {
            title,
            description,
            category: categoryId
        };

        await handleUpdateNodeData(boardId, id, payload);
        setIsEditing(false);
    };

    const handleCategoryChange = (e) => {
        const val = e.target.value;
        if (val === "ADD_NEW") {
            setIsCreatingType(true);
        } else {
            setCategoryId(val);
        }
    };

    const handleAddNewType = async () => {
        if (!newTypeName.trim()) return;
        // Assume handleCreateNodeType returns the newly created type object or we can just rely on state update
        // But since it might not return it directly, we'll just optimistically set it or wait for context
        // Actually, handleCreateNodeType doesn't return the type currently, we might need to modify it.
        // Let's just call it. The context will update.
        await handleCreateNodeType(newTypeName, boardId);

        // We can't perfectly auto-select it if we don't have its ID immediately.
        // For now, we'll exit create mode. User can select it from the newly updated list.
        setIsCreatingType(false);
        setNewTypeName("");
    };

    const { isHighlighted, isDimmed } = data || {};
    const borderClass = isHighlighted ? 'border-2 border-accent-teal shadow-[0_0_15px_rgba(74,139,154,0.8)]' : 'border border-border-subtle hover:border-accent-teal hover:shadow-[0_4px_16px_rgba(74,139,154,0.2)]';
    const opacityClass = isDimmed ? 'opacity-30' : 'opacity-100';

    const categoryItems = [
        { id: "ADD_NEW", label: "+ ADD NEW TYPE" },
        ...nodeCategories.map(cat => ({ id: cat._id, label: cat.name }))
    ];
    const selectedCategoryItem = categoryItems.find(c => c.id === categoryId) || null;

    return (
        <div
            className={`bg-bg-surface rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.5)] w-64 flex flex-col transition-all duration-300 group relative ${borderClass} ${opacityClass}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onDoubleClick={(e) => {
                if (context) {
                    setIsEditing(true);
                    e.stopPropagation();
                }
            }}
        >
            {/* Edit Button overlay */}
            {!isEditing && isHovered && context && (
                <button 
                    onClick={(e) => {
                        setIsEditing(true);
                        e.stopPropagation();
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-bg-app border border-border-subtle rounded text-text-secondary hover:text-text-primary hover:border-accent-teal transition-colors z-30 nodrag"
                    title="Edit Node"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                </button>
            )}

            <Handle
                type="target"
                position={Position.Right}
                className="w-3 h-3 bg-accent-teal border-2 border-bg-surface rounded-full z-10"
                style={{ top: '50%' }}
                isConnectable={true}
            />
            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 bg-transparent border-0 opacity-0 z-20 cursor-crosshair"
                style={{ top: '50%' }}
                isConnectable={true}
            />

            <div className="p-4 flex flex-col space-y-2">
                {isEditing ? (
                    // --- EDIT MODE ---
                    <div className="flex flex-col space-y-3 nodrag cursor-default">
                        {isCreatingType ? (
                            <div className="flex flex-col space-y-2 bg-bg-app p-2 rounded border border-accent-teal">
                                <label className="text-[10px] uppercase font-mono text-text-secondary tracking-widest">New Category</label>
                                <input
                                    type="text"
                                    placeholder="Category Name"
                                    value={newTypeName}
                                    onChange={(e) => setNewTypeName(e.target.value)}
                                    className="w-full bg-bg-surface border border-border-subtle rounded px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
                                    autoFocus
                                />
                                <div className="flex space-x-2">
                                    <button onClick={handleAddNewType} className="flex-1 bg-accent-teal text-bg-app font-bold text-[10px] uppercase py-1 rounded">Add</button>
                                    <button onClick={() => setIsCreatingType(false)} className="flex-1 border border-border-subtle text-text-secondary font-bold text-[10px] uppercase py-1 rounded hover:text-text-primary">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <CustomSelect 
                                items={categoryItems}
                                selectedItem={selectedCategoryItem}
                                onChange={(item) => handleCategoryChange({ target: { value: item.id } })}
                                placeholder="Select Type..."
                            />
                        )}

                        <input
                            type="text"
                            placeholder="Node Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-bg-app border border-border-subtle rounded px-2 py-1 text-sm font-bold text-text-primary focus:outline-none focus:border-accent-teal transition-colors"
                        />

                        <textarea
                            placeholder="Description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="2"
                            className="w-full bg-bg-app border border-border-subtle rounded px-2 py-1 text-xs font-mono text-text-primary focus:outline-none focus:border-accent-teal transition-colors resize-none"
                        />

                        <div className="flex space-x-2 pt-1">
                            <button onClick={handleSave} className="flex-1 bg-accent-teal text-bg-app font-mono font-bold text-xs py-1.5 rounded uppercase hover:opacity-90 transition-opacity">
                                Save
                            </button>
                            <button onClick={() => setIsEditing(false)} className="flex-1 border border-border-subtle text-text-secondary font-mono font-bold text-xs py-1.5 rounded uppercase hover:text-text-primary transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    // --- VIEW MODE ---
                    <>
                        {data.category && (
                            <div className="flex items-start">
                                <span className="inline-block px-2.5 py-0.5 bg-border-subtle/50 text-text-secondary text-[10px] font-mono rounded-full uppercase tracking-wider border border-border-subtle">
                                    {data.category.name}
                                </span>
                            </div>
                        )}

                        <h3 className="font-sans font-bold text-text-primary text-sm leading-snug">
                            {data.title || "Untitled Node"}
                        </h3>

                        {data.description && data.description.trim() !== "" && (
                            <p
                                className="text-xs font-mono text-text-secondary mt-1"
                                style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                            >
                                {data.description}
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
