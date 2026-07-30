import { cursorFromNextLink } from "./pagination";

describe("cursorFromNextLink", () => {
  it("extracts the cursor token from a next link", () => {
    expect(cursorFromNextLink("http://x/session/?cursor=abc123")).toBe(
      "abc123",
    );
  });

  it("returns null when there is no next page", () => {
    expect(cursorFromNextLink(null)).toBeNull();
  });

  it("returns null when the link has no cursor param", () => {
    expect(cursorFromNextLink("http://x/session/")).toBeNull();
  });
});
