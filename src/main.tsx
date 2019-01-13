import "@babel/polyfill";
import * as rollup from "rollup";
import virtual from "rollup-plugin-virtual";
import { readFileSync } from "fs";
import { compile } from "./lib/compileMarkdown";

import React, {
  useRef,
  useLayoutEffect,
  useState,
  useEffect,
  useCallback
} from "react";
import ReactDOM from "react-dom";
import MonacoEditor from "./components/MonacoEditor";
import * as ts from "typescript";

const ReactSource = readFileSync(
  __dirname + "/../node_modules/react/umd/react.development.js"
).toString();

const ReactDOMSource = readFileSync(
  __dirname + "/../node_modules/react-dom/umd/react-dom.development.js"
).toString();

const initialValue =
  localStorage.getItem("editor:value") ||
  `# Markdown Code Runner

- Edit your code with comment like \`// file:<filepath>\`
- Click Run button or Ctrl-S
- Save current beffer by Meta-S

\`\`\`ts
// file:App.tsx
export default (props: { name: string }) => {
  return <div>Hello, {props.name}</div>;
}
\`\`\`

\`\`\`ts
import React from "react";
import ReactDOM from "react-dom";
import App from './App';

const el: any = document.querySelector(".root");
ReactDOM.render(<App name="World" />, el);
\`\`\`
`;

function compileTypeScript(value: string): string {
  return ts.transpileModule(value, {
    compilerOptions: {
      module: ts.ModuleKind.ES2015,
      jsx: ts.JsxEmit.React
      // target: "ES2017"
    }
  }).outputText;
}

function sourceToCode(value: string) {
  const [first] = value.split("\n");
  const match = first.match(/\/\/\sfile\:([\w]+\.(js|ts|jsx|tsx))/);
  const code = compileTypeScript(value);
  if (match != null) {
    const file = match[1];
    if (["index.js", "index.ts", "index.tsx"].includes(file)) {
      return ["index.js", code];
    } else {
      const fileName = file.replace(/\.(js|ts|tsx)$/, "");
      const relFileName = fileName[0] != "." ? `./${fileName}` : fileName;
      return [relFileName, code];
    }
  } else {
    return ["index.js", code];
  }
}

function Runner(props: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(
    () => {
      (async () => {
        if (ref.current) {
          const ret = compile(props.value);

          const codeMap = ret.codeblocks.reduce((acc: object, i: any) => {
            const [filename, code] = sourceToCode(i.value);
            return { ...acc, [filename]: code };
          }, {});
          let html = "";
          try {
            const code = await bundle(codeMap);
            html = `
          <div class="root"></div>
          <script>
            ${ReactSource};
            ${ReactDOMSource};
            ${code};
          </script>
        `;
          } catch (e) {
            console.error(e);
            html = `<div style="color: red;">${e.toString()}</div>`;
          }
          const iframe = createIframe(html);
          iframe.style.width = "50vw";
          iframe.style.height = "calc(80vh)";

          ref.current.innerHTML = "";
          ref.current.appendChild(iframe);
        }
      })();
    },
    [props.value]
  );

  return (
    <div>
      <div ref={ref} />
    </div>
  );
}

function App() {
  const [value, setValue] = useState(initialValue);
  const [runValue, setRunValue] = useState("");

  useLayoutEffect(
    () => {
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
    },
    [value]
  );

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
          <Runner value={runValue} />
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

async function bundle(fileMap: object) {
  const bundle = await rollup.rollup({
    input: "index.js",
    plugins: [
      virtual({
        "index.js": "",
        ...fileMap,
        react: "export default window.React",
        "react-dom": "export default window.ReactDOM",
        vm: readFileSync(__dirname + "/third_party/vm.js").toString()
      })
    ]
  });

  const gen = await bundle.generate({
    format: "iife",
    sourcemap: false,
    name: "window",
    extend: true
  });
  // eval
  const code = gen.output[0].code as string;
  return code;
}

function createIframe(html: string) {
  const iframe: any = document.createElement("iframe");
  iframe.sandbox = "allow-scripts";
  iframe.src = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  return iframe;
}
