# Markdown Code Runner

- Edit your code with comment like `// file:<filepath>`
- Click Run button or Ctrl-R
- Save current beffer by Meta-S
- allowed modules
  - react, react-dom, styled-components

```ts
// file:App.tsx
import styled from "styled";

const Svg = styled.svg`
  width: 400px;
  height: 400px;
`;

const range = (n: number) => Array.from({ length: n }, (v, k) => k);

export default () => {
  return (
    <Svg>
      {range(400).map(n => {
        return (
          <circle
            key={n}
            r={~~((Math.random() * 5) ** 2)}
            cx={~~(Math.random() * 400)}
            cy={~~(Math.random() * 400)}
            fill="red"
            fill={`rgb(${~~(Math.random() * 255)}, 128, 128)`}
          />
        );
      })}
    </Svg>
  );
};
```

```ts
// file:index.tsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const el = document.querySelector(".root");
ReactDOM.render(<App />, el);
```
