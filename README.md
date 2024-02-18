# about

Visualize and Analyze CSGO (and CS2) demo files in your web browser.

- No Install
- No Upload
- No Download

Just open this link, drag'n drop your demo file!

https://shuji-koike.github.io/dem/

Limited (experimental) support to open CS2 files.
CAUTION! very unstable!

Limited (experimental) support to open rar files.
Each dem files in a rar file will be parsed & analyzed in order.
Use the side menu to select a match to open.

[Send a feature request](https://github.com/shuji-koike/dem/discussions/categories/ideas) to help me prioritize what to implement next.

# links

- https://www.hltv.org/results
- https://github.com/markus-wa/demoinfocs-golang

# setup

```
go get
GOOS=js GOARCH=wasm go build -o ./static/main.wasm .
pnpm install
pnpm start
```
