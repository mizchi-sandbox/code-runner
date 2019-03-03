import React, { useState } from "react";
import Modal from "react-modal";
import defaultValue from "raw-loader!./HelpSampleCode.md";
// const defaultValue = "";

export function ModalOpenButton() {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <button onClick={() => setOpened(true)}>show help</button>
      <Modal isOpen={opened} onRequestClose={() => setOpened(false)}>
        <Help />
        <hr />
        <button onClick={() => setOpened(false)}>close</button>
      </Modal>
    </>
  );
}

function Help() {
  return (
    <>
      <h2>Code Runner</h2>
      <p>You can run JS in browser</p>
      <h3>Spec</h3>
      <ul>
        <li>All scripts are compiled as typescript with jsx.</li>
        <li>
          <code>// file:</code> annotation for virtual file system location.
        </li>
        <li>
          loadable modules: <code>react</code>, <code>react-dom</code>
        </li>
        <li>Ctrl-R to Run</li>
      </ul>
      <pre style={{ padding: 20, background: "#eee" }}>
        <code>{defaultValue}</code>
      </pre>
      to be "Hello World"
    </>
  );
}
