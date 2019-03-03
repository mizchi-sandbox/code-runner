import * as ts from "typescript";
import { compile } from "../lib/compileMarkdown";
import React, { useRef, useLayoutEffect } from "react";

import { bundle } from "../lib/bundle";

export function CodeRunner(props: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
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
  }, [props.value]);
  return (
    <div>
      <div ref={ref} />
    </div>
  );
}

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

function createIframe(html: string) {
  const iframe: any = document.createElement("iframe");
  iframe.sandbox = "allow-scripts";
  iframe.src = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  return iframe;
}
