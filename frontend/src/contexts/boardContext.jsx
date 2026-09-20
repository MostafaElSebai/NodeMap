import { createContext, useContext } from 'react';
import useBoards from '../hooks/useBoards';
import useNodes from '../hooks/useNodes';
import useNodeTypes from '../hooks/useNodeTypes';

// 1. Create the empty box
export const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
    // ----------------------------------------------------
    // We now use the custom hooks to separate the logic 
    // from the context provider. The hooks return all the 
    // state and functions we need to broadcast.
    // ----------------------------------------------------
    const globalState = useBoards();

    // We pass dependencies from the main boards state to the sub-hooks
    const nodesState = useNodes({ setNodesArr: globalState.setNodesArr });
    const typesState = useNodeTypes({ setBoardDataById: globalState.setBoardDataById });

    // Merge them into a single context payload
    const mergedState = {
        ...globalState,
        ...nodesState,
        ...typesState
    };

    return (
        <BoardContext.Provider value={mergedState}>
            {children}
        </BoardContext.Provider>
    );
};

// A custom hook so you don't have to import useContext everywhere
export const useBoardContext = () => useContext(BoardContext);