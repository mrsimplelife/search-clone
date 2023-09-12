import useSearch from '../../hooks/useSearch';
import ListItem from '../ListItem';
import Loading from '../Loading';
import RecommendItem from '../RecommendItem';
import styles from './styles.module.css';

function Search() {
  const {
    input,
    index,
    items,
    loading,
    inputRef,
    popupRef,
    recentItems,
    isShowPopup,
    handleChangeInput,
    handleClickItem,
    handleClickDelete,
    handleClickRecentItem,
    handleSubmit,
    handleKeyDown,
    showPopup,
  } = useSearch();

  return (
    <div className={styles.searchContainer}>
      <div className={styles.relativeContainer}>
        <form onSubmit={handleSubmit}>
          <input
            className={styles.searchInput}
            ref={inputRef}
            type="search"
            value={input}
            onChange={handleChangeInput}
            onKeyDown={handleKeyDown}
            onFocus={showPopup}
          />
        </form>

        {isShowPopup && (
          <div className={styles.popup} ref={popupRef}>
            <div>
              최근 검색어
              <ul>
                {recentItems.map(({ id, name }) => (
                  <RecommendItem key={id} id={id} name={name} onClick={handleClickRecentItem} onDelete={handleClickDelete} />
                ))}
              </ul>
            </div>
            <ul>
              {items.length === 0 ? (
                <li className={styles.nothing}>검색 결과가 없습니다.</li>
              ) : (
                items.map(({ sickCd, sickNm }, itemIndex) => <ListItem key={sickCd} title={sickNm} selected={itemIndex === index} onClick={handleClickItem} />)
              )}
            </ul>
            {loading && <Loading />}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
