import useSearch from '../../hooks/useSearch';
import ListItem from '../ListItem';
import RecommendItem from '../RecommendItem';
import styles from './styles.module.css';

function Search() {
  const {
    input,
    index,
    show,
    items,
    loading,
    handleChangeInput,
    handleFocusInput,
    handleKeyDownInput,
    handleClickItem,
    inputRef,
    popupRef,
    recentItems,
    handleDeleteRecentItem,
    handleClickRecentItem,
    handleSubmit,
  } = useSearch();

  return (
    <div className={styles.searchContainer}>
      <div className={styles.relativeContainer}>
        <form onSubmit={(e) => handleSubmit(e, input)}>
          <input
            className={styles.searchInput}
            ref={inputRef}
            type="search"
            value={input}
            onChange={handleChangeInput}
            onFocus={handleFocusInput}
            onKeyDown={(e) => handleKeyDownInput(e, index, items)}
          />
        </form>

        {show && (
          <div className={styles.popup} ref={popupRef}>
            <div>
              최근 검색어
              <ul>
                {recentItems.map(({ id, name }) => (
                  <RecommendItem key={id} id={id} name={name} onClick={handleClickRecentItem} onDelete={handleDeleteRecentItem} />
                ))}
              </ul>
            </div>
            <ul>
              {!!input &&
                items.map(({ sickCd, sickNm }, itemIndex) => (
                  <ListItem key={sickCd} id={sickCd} title={sickNm} selected={itemIndex === index} onClick={handleClickItem} />
                ))}
              {(items.length === 0 || !input) && <li className={styles.listItem}>검색 결과가 없습니다.</li>}
              {loading && <li className={styles.loading}>loading...</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
