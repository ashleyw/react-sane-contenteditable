import serve from "rollup-plugin-serve";
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import jsx from "rollup-plugin-jsx";
import replace from "rollup-plugin-replace";

export default {
  entry: "example/index.js",
  dest: "example/index.min.js",
  format: "iife",
  plugins: [
    nodeResolve({ preferBuiltins: false }),
    babel({
      exclude: "node_modules/**"
    }),
    commonjs({
      include: ["node_modules/**"],
      exclude: ["node_modules/process-es6/**"],
      namedExports: {
        "node_modules/lodash/lodash.js": ["isEqual", "omit", "pick", "without"],
        "node_modules/react/index.js": [
          "Children",
          "Component",
          "PropTypes",
          "createElement"
        ],
        "node_modules/react-dom/index.js": ["render"]
      }
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    jsx({ factory: "React.createElement" }),
    serve("example")
  ]
};
