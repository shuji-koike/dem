# about

Visualize and Analyze CSGO (and CS2) demo files in your web browser.

- No Install
- No Upload
- No Registration

Just open this link, drag'n drop your demo file!

https://shuji-koike.github.io/dem/

Limited (experimental) support to open CS2 dem files.

Limited (experimental) support to open rar files.
Each dem files in a rar file will be parsed & analyzed in order.
Use the side menu to select a match to open.

[Send a feature request](https://github.com/shuji-koike/dem/discussions/categories/ideas) to help me prioritize what to implement next.

https://github.com/shuji-koike/dem/assets/1072158/e5b9e6cc-51e7-4891-989d-1f84767d0fef

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
