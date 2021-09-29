import './ItemFile.css';

export const ItemFile = (props) => {
  const {name, onClick} = props;
  return (
    <div className="item-file" onClick={onClick}>
      <p className="text">{name}</p>
    </div>
  );
};
