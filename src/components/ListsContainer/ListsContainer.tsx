import React from 'react';
import { IList } from '../../types';
import List from '../List/List';
import ActionButton from '../ActionButton/ActionButton';
import { listContainer } from './ListsContainer.css';

type TListsContainerProps = {
  lists: IList[];
  boardId: string;
};

const ListsContainer: React.FC<TListsContainerProps> = ({ lists, boardId }) => {
  return (
    <div className={listContainer}>
      {lists.map((list) => (
        <List key={list.listId} list={list} boardId={boardId} />
      ))}
      <ActionButton boardId={boardId} listId={''} list />
    </div>
  );
};

export default ListsContainer;
