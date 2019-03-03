```ts
// file:App.tsx
import React from "react";
export default (props: { name: string }) => {
  return <div>Hello, {props.name}</div>;
};
```

```ts
// file:index.tsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const el = document.querySelector(".root");
ReactDOM.render(<App name="World" />, el);
```
