import { TIME_MODE } from "../constants";
import reducer from "./media";

describe("media reducer", () => {
  it("defaults to showing remaining time", () => {
    expect(reducer(undefined, { type: "@@INIT" } as any).timeMode).toBe(
      TIME_MODE.REMAINING
    );
  });
});
