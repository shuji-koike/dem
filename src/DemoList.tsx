import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

export const DemoList: React.FC = () => {
  const [state, setState] = React.useState([]);
  React.useEffect(() => {
    axios.get("/api/files").then(({ data }) => setState(data));
  }, []);
  return (
    <ul>
      {state.map(e => (
        <li key={e}>
          <DemoItem file={e}></DemoItem>
        </li>
      ))}
    </ul>
  );
};

const DemoItem: React.FC<{ file: string }> = ({ file }) => {
  if (/\.dem$/.test(file)) {
    return <Link to={`/dem/${file}`}>{file}</Link>;
  } else if (/\.rar$/.test(file)) {
    return <RarItem file={file} />;
  } else {
    return <span>{file}</span>;
  }
};

const RarItem: React.FC<{ file: string }> = ({ file }) => {
  const [state, setState] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    console.log(file);
    if (!open) return;
    axios.get(`/api/files/${file}`).then(({ data }) => setState(data));
  }, [open]);
  return (
    <>
      <span onClick={() => setOpen(!open)}>{file}</span>
      {open && (
        <ul>
          {state.map((e, i) => (
            <li>
              <Link key={i} to={`/dem/${file}?file=${e}`} children={e} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
