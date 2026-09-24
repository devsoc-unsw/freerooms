import "@testing-library/jest-dom";

const outdatedJsxTransformWarning =
  "Your app (or one of its dependencies) is using an outdated JSX transform.";

const originalWarn = console.warn.bind(console);

const warningSpy = jest.spyOn(console, "warn").mockImplementation((...args) => {
  const [message] = args;

  if (
    typeof message === "string" &&
    message.startsWith(outdatedJsxTransformWarning)
  ) {
    return;
  }

  originalWarn(...args);
});

afterAll(() => {
  warningSpy.mockRestore();
});
