import supertest from "supertest";
import { router } from "./hltv";

const app = supertest(router);

describe("GET /www.hltv.org/results", () => {
  it("200", async () => {
    const result = await app.get("/www.hltv.org/results");
    expect(result.text).toEqual("hello");
    expect(result.status).toEqual(200);
  });
});
