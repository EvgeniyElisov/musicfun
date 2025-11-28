import { PageSizeSelector } from "./PageSizeSelector";
import s from "./Pagination.module.css";
import { PaginationControls } from "./PaginationControls";

type Props = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pagesCount: number;
  pageSize: number;
  changePageSize: (size: number) => void;
};

export const Pagination = ({currentPage, setCurrentPage, pagesCount, pageSize, changePageSize}: Props) => {
  return (
    <div className={s.container}>
      <div className={s.pagination}>
        <PaginationControls currentPage={currentPage} setCurrentPage={setCurrentPage} pagesCount={pagesCount}/>
        <PageSizeSelector pageSize={pageSize} changePageSize={changePageSize}/>
      </div>
    </div>
  );
};
