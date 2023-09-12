import { memo } from 'react';
import styles from './styles.module.css';

type ListItemProps = {
  title: string;
  onClick: (sickNm: string) => void;
  selected: boolean;
};

const ListItem = memo(function Item({ title, selected, onClick }: ListItemProps) {
  return (
    <li className={`${styles.listItem} ${selected ? styles.selected : ''}`} onClick={() => onClick(title)}>
      {title}
    </li>
  );
});

export default ListItem;
