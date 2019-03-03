import React, { useLayoutEffect, useState, Suspense } from "react";
import { CodeRunner } from "../components/CodeRunner";
import { createGlobalStyle } from "styled-components";
import { ModalOpenButton } from "../components/ModalOpenButton";
import { VIEW_PAGE_PREFIX } from "../main";
import MonacoEditor from "../components/MonacoEditor";
import { Base64 } from "../lib/base64";
const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;

export default function Main({
  initialValue,
  disabled
}: {
  initialValue: string;
  disabled: boolean;
}) {
  const [step, setStep] = useState(0);
  const [value, setValue] = useState(initialValue);
  const [runValue, setRunValue] = useState("");
  useLayoutEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.ctrlKey && ev.key.toLowerCase() === "r") {
        ev.preventDefault();
        setRunValue(value);
        setStep(Math.random());
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
          <CodeRunner key={step} value={runValue} />
        </div>
      </div>
    </>
  );
}
