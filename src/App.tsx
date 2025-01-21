import { useState } from 'react';
import { appContainer, board, buttons } from './App.css';
import BoardList from './components/BoardList/BoardList';
import ListsContainer from './components/ListsContainer/ListsContainer';
import { useTypedSelector } from './hooks/redux';

function App() {
  const [activeBoardId, setActiveBoardId] = useState('board-0');
  const boards = useTypedSelector((state) => state.boards.boardArray);
  const getActiveBoard = boards.filter(
    (board) => board.boardId === activeBoardId
  )[0];
  const lists = getActiveBoard.lists;

  return (
    <div className={appContainer}>
      <BoardList
        activeBoardId={activeBoardId}
        setActiveBoardId={setActiveBoardId}
      />
      <div className={board}>
        <ListsContainer lists={lists} boardId={getActiveBoard.boardId} />
        {/**이 부분도 현재 상태에 있는 activeBoardId가 더 명확할 것 같은데 왜 이렇게 했는지 나중에 테스트 */}
      </div>
      <div className={buttons}>
        <button>이 게시판 삭제하기기</button>
        <button></button>
      </div>
    </div>
  );
}

export default App;
