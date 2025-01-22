import { useState } from 'react';
import {
  appContainer,
  board,
  buttons,
  deleteBoardButton,
  loggerButton,
} from './App.css';
import BoardList from './components/BoardList/BoardList';
import ListsContainer from './components/ListsContainer/ListsContainer';
import { useTypedSelector } from './hooks/redux';
import EditModal from './components/EditModal/EditModal';
import LoggerModal from './components/LoggerModal/LoggerModal';

function App() {
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [activeBoardId, setActiveBoardId] = useState('board-0');
  const modalActive = useTypedSelector((state) => state.boards.modalActive);
  const boards = useTypedSelector((state) => state.boards.boardArray);
  const getActiveBoard = boards.filter(
    (board) => board.boardId === activeBoardId
  )[0];
  const lists = getActiveBoard.lists;

  return (
    <div className={appContainer}>
      {isLoggerOpen ? <LoggerModal setIsLoggerOpen={setIsLoggerOpen} /> : null}
      {modalActive ? <EditModal /> : null}
      {/**이 부분 && 로 해도 될라나 나중에 테스트 */}
      <BoardList
        activeBoardId={activeBoardId}
        setActiveBoardId={setActiveBoardId}
      />
      <div className={board}>
        <ListsContainer lists={lists} boardId={getActiveBoard.boardId} />
        {/**이 부분도 현재 상태에 있는 activeBoardId가 더 명확할 것 같은데 왜 이렇게 했는지 나중에 테스트 */}
      </div>
      <div className={buttons}>
        <button className={deleteBoardButton}>이 게시판 삭제하기</button>
        <button className={loggerButton} onClick={() => setIsLoggerOpen(true)}>
          {isLoggerOpen ? '활동 목록 숨기기' : '활동 목록 보이기'}
        </button>
      </div>
    </div>
  );
}

export default App;
