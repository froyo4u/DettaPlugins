import { existsSync } from "fs";
import { readFile, writeFile, readdir, mkdir } from "fs/promises";
import { extname } from "path";
import { createHash } from "crypto";

import { rollup } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import swc from "@swc/core";

const mdNote = `<!--
\t* This file was autogenerated
\t* If you want to change anything, do so in the build.mjs file
\t* https://github.com/Gabe616/VendettaPlugins/edit/main/build.mjs
-->`;

const extensions = [".js", ".jsx", ".mjs", ".ts", ".tsx", ".cts", ".mts"];
const ignorePlugins = [
  "better-spotify-preview",
  "reaction-notifications",
  "download-everything",
  "fxtwitter",
];

if (!existsSync("./dist")) await mkdir("./dist");
await writeFile(
  "./dist/404.md",
  `---
permalink: /404.html
---

${mdNote}

<div align="center">
  <h1>Well, that's awkward.</h1>
  <h3>You probably misclicked or something, click <a href="/"><b>here</b></a> to go back.</h3>
</div>\n`
);

/** @type import("rollup").InputPluginOption */
const plugins = [
  nodeResolve(),
  commonjs(),
  {
    name: "swc",
    async transform(code, id) {
      const ext = extname(id);
      if (!extensions.includes(ext)) return null;

      const ts = ext.includes("ts");
      const tsx = ts ? ext.endsWith("x") : undefined;
      const jsx = !ts ? ext.endsWith("x") : undefined;

      const result = await swc.transform(code, {
        filename: id,
        jsc: {
          externalHelpers: false,
          parser: {
            syntax: ts ? "typescript" : "ecmascript",
            tsx,
            jsx,
          },
        },
        env: {
          targets: "defaults",
          include: ["transform-classes", "transform-arrow-functions"],
        },
      });
      return result.code;
    },
  },
  esbuild({ minify: !process.argv.includes("--nominify") }),
];

for (let plug of await readdir("./plugins")) {
  if (ignorePlugins.includes(plug)) continue;
  const manifest = JSON.parse(
    await readFile(`./plugins/${plug}/manifest.json`)
  );
  const outPath = `./dist/${plug}/index.js`;

  const title = `${manifest.name} (by ${manifest.authors
    .map((x) => x.name)
    .join(", ")})`;

  if (!existsSync(`./dist/${plug}`)) await mkdir(`./dist/${plug}`);
  await writeFile(
    `./dist/${plug}/README.md`,
    `${mdNote}

<div align="center">
    <h1>${title}</h1>
    <h3>${manifest.description}</h3>
</div>

> **Note**
> This is just a simple landing page for **${manifest.name}**. The proper way to load this plugin is to go in Vendetta's Plugin settings and tapping the plus icon.\n`
  );

  try {
    const bundle = await rollup({
      input: `./plugins/${plug}/${manifest.main}`,
      onwarn: () => {},
      plugins,
    });

    await bundle.write({
      file: outPath,
      globals(id) {
        if (id.startsWith("@vendetta"))
          return id.substring(1).replace(/\//g, ".");
        const map = {
          react: "window.React",
        };

        return map[id] || null;
      },
      format: "iife",
      compact: true,
      exports: "named",
    });
    await bundle.close();

    const toHash = await readFile(outPath);
    manifest.hash = createHash("sha256").update(toHash).digest("hex");
    manifest.main = "index.js";
    await writeFile(`./dist/${plug}/manifest.json`, JSON.stringify(manifest));

    console.log(`Successfully built ${manifest.name}!`);
  } catch (e) {
    console.error("Failed to build plugin...", e);
    process.exit(1);
  }
}
