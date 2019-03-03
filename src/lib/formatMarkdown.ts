// let markdown: any = null;
let prettier: any = null;
let plugins: any = null;
// let typescript: any = null;

export default function formatMarkdown(md: string) {
  if (prettier && plugins) {
    return prettier.format(md, {
      parser: "markdown",
      plugins
    });
  } else {
    return md;
  }
}

// Start lazy load
console.time("load:prettier");
(async () => {
  const [p0, ...newPlugins] = await Promise.all([
    import("prettier/standalone"),
    import("prettier/parser-markdown"),
    import("prettier/parser-babylon"),
    import("prettier/parser-typescript")
  ]);
  prettier = p0.default || p0;
  plugins = newPlugins;
  // markdown = p1.default || p1;
  // typescript = p2.default || p1;

  console.timeEnd("load:prettier");
})();
