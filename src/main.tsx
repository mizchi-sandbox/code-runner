import "@babel/polyfill";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import defaultValue from "raw-loader!./code.md";
// import Main from "./pages/Main";
import { Base64 } from "./lib/base64";

Modal.setAppElement(document.querySelector(".modal") as HTMLElement);

const Main = React.lazy(() => import("./pages/Main"));
const Preview = React.lazy(() => import("./pages/Preview"));

export const VIEW_PAGE_PREFIX = "/view-";
const main = async () => {
  const root = document.querySelector(".root") as HTMLDivElement;
  const url = new URL(location.href);

  if (url.pathname.startsWith(VIEW_PAGE_PREFIX)) {
    const initialValue = Base64.decode(
      url.pathname.replace(VIEW_PAGE_PREFIX, "")
    );
    ReactDOM.render(
      <Suspense fallback={<span>loading...</span>}>
        <Preview runValue={initialValue} />
      </Suspense>,
      root
    );
  } else {
    const initialValue = localStorage.getItem("editor:value") || defaultValue;
    ReactDOM.render(
      <Suspense fallback={<span>loading...</span>}>
        <Main initialValue={initialValue} disabled={false} />
      </Suspense>,
      root
    );
  }
};

main();
