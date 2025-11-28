type Props = {
  pageSize: number;
  changePageSize: (size: number) => void;
};

export const PageSizeSelector = ({ pageSize, changePageSize }: Props) => {
  return (
    <label>
      Показывать по
      <select name={"select-page-size"} value={pageSize} onChange={(e) => changePageSize(Number(e.target.value))}>
        {[2, 4, 8, 16, 32].map((size) => (
          <option value={size} key={size}>{size}</option>
        ))}
      </select>
      на странице
    </label>
  );
};
