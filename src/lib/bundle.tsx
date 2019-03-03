import path from "path";
import * as rollup from "rollup";

// TODO: import js
export async function bundle(fileMap: object): Promise<string> {
  const bundle = await rollup.rollup({
    input: "index.js",
    plugins: [
      virtual({
        "index.js": "",
        ...fileMap,
        react: "export default window.React",
        "react-dom": "export default window.ReactDOM"
      })
    ]
  });
  const gen = await bundle.generate({
    format: "iife",
    sourcemap: false,
    name: "window",
    extend: true
  });
  // eval
  return gen.output[0].code as string;
}

// plugin

const PREFIX = `\0virtual:`;

function virtual(modules: any): rollup.Plugin {
  const resolvedIds = new Map();

  Object.keys(modules).forEach(id => {
    resolvedIds.set(path.resolve(id), modules[id]);
  });

  return {
    name: "virtual",

    resolveId(id, importer) {
      if (id in modules) {
        return PREFIX + id;
      }

      if (importer) {
        if (importer.startsWith(PREFIX))
          importer = importer.slice(PREFIX.length);
        const resolved = path.resolve(path.dirname(importer), id);
        if (resolvedIds.has(resolved)) {
          return PREFIX + resolved;
        }
      }
    },

    load(id: string) {
      if (id.startsWith(PREFIX)) {
        id = id.slice(PREFIX.length);

        return id in modules ? modules[id] : resolvedIds.get(id);
      }
    }
  };
}
