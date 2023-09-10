import styles from './styles.module.css';

type RecommendItemProps = {
  id: number;
  name: string;
  onClick: (id: number) => void;
  onDelete: (id: number) => void;
};

const RecommendItem = function RecommendItem({ id, name, onClick, onDelete }: RecommendItemProps) {
  return (
    <li className={styles.listItem} onClick={() => onClick(id)}>
      {name}
      <button
        className={styles.button}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}
      >
        X
      </button>
    </li>
  );
};

export default RecommendItem;
