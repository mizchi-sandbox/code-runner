import React, { useState, useEffect } from "react";
import { CodeRunner } from "../components/CodeRunner";
import { compile } from "../lib/compileMarkdown";
import "highlight.js/styles/default";
import "github-markdown-css/github-markdown";
import DOMPurify from "dompurify";

export default ({ runValue }: { runValue: string }) => {
  const [ran, setRan] = useState(false);
  const html = compile(runValue);
  useEffect(() => {
    document.title = runValue.split("\n")[0].replace(/\#+\s/, "");
  }, []);
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden"
      }}
    >
      <div
        className="markdown-body"
        style={{ flex: 1, paddingLeft: 30, overflow: "auto" }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html.html) }}
        />
      </div>

      <div style={{ flex: 1 }}>
        <a type="button" href={location.href.replace("/view-", "/")}>
          edit
        </a>
        {ran ? (
          <CodeRunner value={runValue} />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%"
            }}
          >
            <button
              style={{ width: "50%", height: "80%" }}
              onClick={() => setRan(true)}
            >
              Click to Run
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
