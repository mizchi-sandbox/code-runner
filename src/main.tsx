import "@babel/polyfill";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import defaultValue from "raw-loader!./code.md";
const lzString = require("./lib/lz-string");

Modal.setAppElement(document.querySelector(".modal") as HTMLElement);

const Main = React.lazy(() => import("./pages/Main"));
const Preview = React.lazy(() => import("./pages/Preview"));

export const VIEW_PAGE_PREFIX = "/view-";
const Loader = () => (
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
    Loading...
  </div>
);

const main = async () => {
  const root = document.querySelector(".root") as HTMLDivElement;
  const url = new URL(location.href);

  if (url.pathname.startsWith(VIEW_PAGE_PREFIX)) {
    const initialValue = lzString.decompressFromEncodedURIComponent(
      url.pathname.replace(VIEW_PAGE_PREFIX, "")
    );

    ReactDOM.render(
      <Suspense fallback={<Loader />}>
        <Preview runValue={initialValue} />
      </Suspense>,
      root
    );
  } else {
    let initialValue = defaultValue;
    if (url.pathname.length > 1) {
      initialValue = lzString.decompressFromEncodedURIComponent(
        url.pathname.slice(1)
      );
    } else {
      initialValue = localStorage.getItem("editor:value");
    }

    ReactDOM.render(
      <Suspense fallback={<Loader />}>
        <Main initialValue={initialValue} disabled={false} />
      </Suspense>,
      root
    );
  }
};

main();
