import { memo } from 'react';
import styles from './styles.module.css';

type ListItemProps = {
  id: string;
  title: string;
  onClick: (id: string) => void;
  selected: boolean;
};

const ListItem = memo(function Item({ id, title, selected, onClick }: ListItemProps) {
  return (
    <li className={`${styles.listItem} ${selected ? styles.selected : ''}`} onClick={() => onClick(id)}>
      {title}
    </li>
  );
});

export default ListItem;
