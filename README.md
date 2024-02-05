# about

Visualize and Analyze CSGO demo files in your web browser.

- No Install
- No Upload
- No Download

Just open this link, drag'n drop your demo file!

https://shuji-koike.github.io/dem/

Although, only very basic features are available.

[Send a feature request](https://github.com/shuji-koike/dem/discussions/categories/ideas) to help me prioritize what to implement next.

# setup

```
go get
GOOS=js GOARCH=wasm go build -o ./static/main.wasm .
pnpm install
pnpm start
```
