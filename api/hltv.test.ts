import supertest from "supertest";

const app = supertest(require("./hltv"));

describe("GET /www.hltv.org/results?content=demo", () => {
  it("200", async () => {
    const result = await app.get("/www.hltv.org/results?content=demo");
    expect(result.text).toEqual("hello");
    expect(result.status).toEqual(200);
  });
});
