import "@babel/polyfill";
import React, { useLayoutEffect, useState, Suspense } from "react";
import ReactDOM from "react-dom";
import { CodeRunner } from "./components/CodeRunner";
import { createGlobalStyle } from "styled-components";
import Modal from "react-modal";
import { ModalOpenButton } from "./components/ModalOpenButton";
import defaultValue from "raw-loader!./code.md";

// const defaultValue = "";

Modal.setAppElement(document.querySelector(".modal") as HTMLElement);

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;

const Base64 = {
  encode(str: string) {
    return btoa(unescape(encodeURIComponent(str)));
  },
  decode(str: string) {
    return decodeURIComponent(escape(atob(str)));
  }
};

const MonacoEditor = React.lazy(async () =>
  import("./components/MonacoEditor")
);

function App({
  initialValue,
  disabled
}: {
  initialValue: string;
  disabled: boolean;
}) {
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
      <GlobalStyle />
      <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
        <div style={{ flex: 1, maxWidth: "50vw" }}>
          <Suspense fallback={() => <>loading...</>}>
            {disabled && (
              <textarea
                disabled={disabled}
                value={value}
                style={{ width: "45vw", height: "90vh" }}
              />
            )}
            {!disabled && (
              <MonacoEditor
                value={value}
                width="50vw"
                onChangeValue={(value: string) => {
                  setValue(value);
                  history.replaceState(
                    "",
                    {} as any,
                    `/${Base64.encode(value)}`
                  );
                }}
              />
            )}
          </Suspense>
        </div>
        <div style={{ flex: 1, maxWidth: "50%", overflow: "hidden" }}>
          <div>
            <button onClick={() => setRunValue(value)}>Run(Ctrl-S)</button>|
            <button
              onClick={() => {
                const u = new URL(location.href);
                u.pathname = `${VIEW_PAGE_PREFIX}${Base64.encode(value)}`;
                // @ts-ignore
                navigator.clipboard.writeText(u.toString());
              }}
            >
              Copy public path to clipboard
            </button>
            |
            <ModalOpenButton />
          </div>
          <CodeRunner value={runValue} />
        </div>
      </div>
    </>
  );
}

const VIEW_PAGE_PREFIX = "/view-";
const main = async () => {
  const root = document.querySelector(".root") as HTMLDivElement;
  const url = new URL(location.href);

  if (url.pathname.startsWith(VIEW_PAGE_PREFIX)) {
    const initialValue = Base64.decode(
      url.pathname.replace(VIEW_PAGE_PREFIX, "")
    );
    ReactDOM.render(<App initialValue={initialValue} disabled={false} />, root);
  } else {
    const initialValue = localStorage.getItem("editor:value") || defaultValue;
    ReactDOM.render(<App initialValue={initialValue} disabled={false} />, root);
  }
};

main();
