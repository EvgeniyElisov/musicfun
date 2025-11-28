import { getPaginationPages } from "@/common/utils";
import s from "./PaginationControls.module.css"

type Props = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pagesCount: number;
};

export const PaginationControls = ({currentPage, setCurrentPage, pagesCount}: Props) => {

  if (pagesCount <= 1) return null;

  const pages = getPaginationPages(currentPage, pagesCount);

  return (
    <>
      {pages.map((page, idx) =>
        page === "..." 
        ? <span className={s.ellipsis} key={`ellipsis-${idx}`}>...</span>
        : (
          <button
            key={page}
            className={
              page === currentPage
                ? `${s.pageButton} ${s.pageButtonActive}`
                : s.pageButton
            }
            onClick={() => page !== currentPage && setCurrentPage(Number(page))}
            disabled={page === currentPage}
            type="button"
          >
            {page}
          </button>
        )
      )}
    </>
  );
};
