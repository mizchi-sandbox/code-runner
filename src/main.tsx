import "@babel/polyfill";

import React, { useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";
import MonacoEditor from "./components/MonacoEditor";
import { CodeRunner } from "./components/CodeRunner";

const initialValue =
  localStorage.getItem("editor:value") ||
  `# Markdown Code Runner

- Edit your code with comment like \`// file:<filepath>\`
- Click Run button or Ctrl-R
- Save current beffer by Meta-S

\`\`\`ts
// file:App.tsx
import React from "react";
export default (props: { name: string }) => {
  return <div>Hello, {props.name}</div>;
}
\`\`\`

\`\`\`ts
// file:index.tsx
import React from "react";
import ReactDOM from "react-dom";
import App from './App';

const el = document.querySelector(".root");
ReactDOM.render(<App name="World" />, el);
\`\`\`
`;

function App() {
  const [value, setValue] = useState(initialValue);
  const [runValue, setRunValue] = useState("");

  useLayoutEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.ctrlKey && ev.key.toLowerCase() === "r") {
        ev.preventDefault();
        setRunValue(value);
      }

      if (ev.metaKey && ev.key.toLowerCase() === "s") {
        ev.preventDefault();
        localStorage.setItem("editor:value", value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [value]);

  return (
    <>
      <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
        <div style={{ flex: 1, maxWidth: "50vw" }}>
          <MonacoEditor
            value={value}
            width="50vw"
            onChangeValue={value => {
              setValue(value);
            }}
          />
        </div>
        <div style={{ flex: 1, maxWidth: "50%" }}>
          <button onClick={() => setRunValue(value)}>Run</button>
          <CodeRunner value={runValue} />
        </div>
      </div>
    </>
  );
}

const main = async () => {
  const root = document.querySelector(".root") as HTMLDivElement;
  ReactDOM.render(<App />, root);
};

main();
