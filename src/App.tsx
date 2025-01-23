import { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import {
  appContainer,
  board,
  buttons,
  deleteBoardButton,
  loggerButton,
} from './App.css';
import BoardList from './components/BoardList/BoardList';
import ListsContainer from './components/ListsContainer/ListsContainer';
import { useTypedDispatch, useTypedSelector } from './hooks/redux';
import EditModal from './components/EditModal/EditModal';
import LoggerModal from './components/LoggerModal/LoggerModal';
import { deleteBoard, sort } from './store/slices/boardsSlice';
import { addLog } from './store/slices/loggerSlice';
import { v4 } from 'uuid';

function App() {
  const dispatch = useTypedDispatch();
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [activeBoardId, setActiveBoardId] = useState('board-0');
  const modalActive = useTypedSelector((state) => state.boards.modalActive);
  const boards = useTypedSelector((state) => state.boards.boardArray);
  const getActiveBoard = boards.filter(
    (board) => board.boardId === activeBoardId
  )[0];
  const lists = getActiveBoard.lists;

  const handleDeleteBoard = () => {
    if (boards.length > 1) {
      dispatch(deleteBoard({ boardId: getActiveBoard.boardId })); // 여기 그냥 activeBoardId 넣는게 더 가독성 좋을 것 같은데 나중에 테스트트
      dispatch(
        addLog({
          logId: v4(),
          logMessage: `게시판 삭제하기 : ${getActiveBoard.boardName}`,
          logAuthor: 'user',
          logTimestamp: String(Date.now()),
        })
      );
      const newIndexToSet = () => {
        const indexToBeDeleted = boards.findIndex(
          (board) => board.boardId === activeBoardId
        );
        return indexToBeDeleted === 0
          ? indexToBeDeleted + 1
          : indexToBeDeleted - 1;
      };
      setActiveBoardId(boards[newIndexToSet()].boardId);
    } else {
      alert('최소 게시판 개수는 한 개입니다.');
    }
  };

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    const sourceList = lists.filter(
      (list) => list.listId === source.droppableId
    )[0];

    dispatch(
      sort({
        boardIndex: boards.findIndex(
          (board) => board.boardId === activeBoardId
        ),
        droppableIdStart: source.droppableId,
        droppableIdEnd: destination.droppableId,
        droppableIndexStart: source.index,
        droppableIndexEnd: destination.index,
        draggableId,
      })
    );

    dispatch(
      addLog({
        logId: v4(),
        logMessage: `리스트 "${sourceList.listName}"을 리스트"${
          lists.filter((list) => list.listId === destination.droppableId)[0]
            .listName
        }"으로 ${
          sourceList.tasks.filter((task) => task.taskId === draggableId)[0]
            .taskName
        }을 옮김`,
        logAuthor: 'user',
        logTimestamp: String(Date.now()), // 로그에 타임스탬프 넣어줄 때 string으로 굳이 변환해서 넣는 이유 알아보기. 로그에서 쓸 때 number로 변환하던데
      })
    );
  };

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
        <DragDropContext onDragEnd={handleDragEnd}>
          <ListsContainer lists={lists} boardId={getActiveBoard.boardId} />
          {/**이 부분도 현재 상태에 있는 activeBoardId가 더 명확할 것 같은데 왜 이렇게 했는지 나중에 테스트 */}
        </DragDropContext>
      </div>
      <div className={buttons}>
        <button className={deleteBoardButton} onClick={handleDeleteBoard}>
          이 게시판 삭제하기
        </button>
        <button className={loggerButton} onClick={() => setIsLoggerOpen(true)}>
          {isLoggerOpen ? '활동 목록 숨기기' : '활동 목록 보이기'}
        </button>
      </div>
    </div>
  );
}

export default App;
