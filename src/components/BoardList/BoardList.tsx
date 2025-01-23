import React, { useRef, useState } from 'react';
import { useTypedDispatch, useTypedSelector } from '../../hooks/redux';
import SideForm from './SideForm/SideForm';
import { FiLogIn, FiPlusCircle } from 'react-icons/fi';
import {
  addButton,
  addSection,
  boardItem,
  boardItemActive,
  container,
  title,
} from './BoardList.css';
import clsx from 'clsx';
import { GoSignOut } from 'react-icons/go';
import { app } from '../../firebase';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { removeUser, setUser } from '../../store/slices/userSlice';
import { useAuth } from '../../hooks/useAuth';

type TBoardListProps = {
  activeBoardId: string;
  setActiveBoardId: React.Dispatch<React.SetStateAction<string>>;
};

const BoardList: React.FC<TBoardListProps> = ({
  activeBoardId,
  setActiveBoardId,
}) => {
  const dispatch = useTypedDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { boardArray } = useTypedSelector((state) => state.boards);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    setIsFormOpen(!isFormOpen);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const { isAuth } = useAuth();

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((userCredential) => {
        dispatch(
          setUser({
            email: userCredential.user.email!,
            id: userCredential.user.uid,
          })
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        dispatch(removeUser());
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className={container}>
      <div className={title}>게시판 : </div>
      {boardArray.map((board, index) => (
        <div
          key={board.boardId}
          onClick={() => setActiveBoardId(boardArray[index].boardId)} // 여기 왜 board.boardId가 아니라 저렇게 넣지? 나중에 다 만들면 테스트 할 것
          className={clsx(
            {
              [boardItemActive]:
                boardArray.findIndex((b) => b.boardId === activeBoardId) ===
                index,
            },
            {
              [boardItem]:
                boardArray.findIndex((b) => b.boardId === activeBoardId) !==
                index,
            }
          )}
        >
          <div>{board.boardName}</div>
        </div>
      ))}
      <div className={addSection}>
        {isFormOpen ? (
          <SideForm inputRef={inputRef} setIsFormOpen={setIsFormOpen} />
        ) : (
          <FiPlusCircle className={addButton} onClick={handleClick} />
        )}
        {isAuth ? (
          <GoSignOut className={addButton} onClick={handleLogout} />
        ) : (
          <FiLogIn className={addButton} onClick={handleLogin} />
        )}
      </div>
    </div>
  );
};

export default BoardList;
