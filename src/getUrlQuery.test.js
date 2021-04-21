const { getUrlQuery } = require("./index");

test("get query parameter", () => {
  expect(getUrlQuery("q", "?q=123")).toBe("123");
});

test("get query parameter from multiple parameters", () => {
  expect(getUrlQuery("q", "?q=123&r=456")).toBe("123");
});

test("throws exception when no query parameter with the name", () => {
  expect(() => getUrlQuery("q", "?r=456")).toThrow();
});
