import { useBoardContext } from "../contexts/boardContext";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import BoardPreview from "../components/BoardPreview";

export default function Boards() {
    const { getBoards, loading, addBoard, boards } = useBoardContext();
    const [name, setName] = useState("");
    const [showInput, setShowInput] = useState(false);

    useEffect(() => {
        getBoards();
    }, []);

    const onAddBoardSubmit = async () => {
        if (!name.trim()) return;
        await addBoard(name);
        setName("");
        setShowInput(false);
    };

    return (
        <div className="min-h-screen bg-bg-app px-8 pb-8 pt-32 md:px-12 md:pb-12 md:pt-40 lg:px-16 lg:pb-16">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold font-sans text-text-primary tracking-tight">My Workspace</h1>
                        <p className="text-sm font-mono text-text-secondary mt-2">Manage and create your NodeMap boards.</p>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="text-accent-teal font-mono animate-pulse">Loading boards...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        
                        {/* Create New Board Card */}
                        <div className="h-64 bg-bg-surface border-2 border-dashed border-border-subtle rounded-lg flex flex-col items-center justify-center p-6 hover:border-accent-teal transition-colors group">
                            {!showInput ? (
                                <button 
                                    onClick={() => setShowInput(true)}
                                    className="w-full h-full flex flex-col items-center justify-center space-y-4"
                                >
                                    <div className="w-12 h-12 rounded-full bg-bg-app border border-border-subtle flex items-center justify-center group-hover:bg-accent-teal/10 group-hover:border-accent-teal transition-all">
                                        <span className="text-2xl text-text-secondary group-hover:text-accent-teal leading-none mb-1">+</span>
                                    </div>
                                    <span className="font-mono text-sm text-text-secondary group-hover:text-accent-teal transition-colors uppercase tracking-widest">Create Board</span>
                                </button>
                            ) : (
                                <div className="w-full flex flex-col space-y-4">
                                    <input 
                                        type="text" 
                                        placeholder="Board Name..."
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && onAddBoardSubmit()}
                                        autoFocus
                                        className="w-full bg-bg-app border border-border-subtle rounded px-4 py-2 text-text-primary focus:outline-none focus:border-accent-teal transition-colors font-mono text-sm"
                                    />
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={onAddBoardSubmit}
                                            disabled={!name.trim()}
                                            className="flex-1 bg-accent-teal text-bg-app font-mono font-bold py-2 rounded hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                                        >
                                            CREATE
                                        </button>
                                        <button 
                                            onClick={() => { setShowInput(false); setName(""); }}
                                            className="px-4 border border-border-subtle text-text-secondary font-mono py-2 rounded hover:text-text-primary hover:bg-bg-app transition-all text-sm"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Render Boards */}
                        {boards.map(board => (
                            <Link 
                                to={`/boards/${board._id}`} 
                                key={board._id}
                                className="group h-64 bg-bg-surface border border-border-subtle rounded-lg flex flex-col overflow-hidden hover:border-text-primary hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Board Preview Area */}
                                <div className="h-40 w-full relative border-b border-border-subtle overflow-hidden">
                                    <BoardPreview boardId={board._id} />
                                </div>
                                
                                {/* Board Info */}
                                <div className="flex-1 p-4 flex flex-col justify-between">
                                    <h3 className="font-sans font-bold text-text-primary truncate">{board.name}</h3>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs font-mono text-text-secondary group-hover:text-accent-teal transition-colors">Open Board</span>
                                        <span className="text-xs font-mono text-text-secondary group-hover:text-accent-teal transition-colors">→</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}