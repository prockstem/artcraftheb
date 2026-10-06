import { applyDomTranslation, translateUiText } from "./dom-translator";

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("dom translator", () => {
  afterEach(() => {
    applyDomTranslation("en");
    document.body.innerHTML = "";
  });

  it("translates exact UI text and attributes, then restores English", () => {
    document.body.innerHTML = `
      <button title="Delete track"> Undo </button>
      <input placeholder="Search..." />
      <p>Undo the thing I typed</p>`;
    applyDomTranslation("he");

    const button = document.querySelector("button")!;
    expect(button.textContent).toBe(" ביטול פעולה ");
    expect(button.getAttribute("title")).toBe("מחיקת רצועה");
    expect(document.querySelector("input")!.placeholder).toBe("חיפוש...");
    // Not an exact match, so it is left alone.
    expect(document.querySelector("p")!.textContent).toBe(
      "Undo the thing I typed",
    );

    applyDomTranslation("en");
    expect(button.textContent).toBe(" Undo ");
    expect(button.getAttribute("title")).toBe("Delete track");
  });

  it("translates nodes added or changed after start", async () => {
    applyDomTranslation("he");
    const span = document.createElement("span");
    span.textContent = "Loading...";
    document.body.appendChild(span);
    await flush();
    expect(span.textContent).toBe("טוען...");

    span.firstChild!.nodeValue = "Saved";
    await flush();
    expect(span.textContent).toBe("נשמר");

    span.firstChild!.nodeValue = "My Project";
    await flush();
    expect(span.textContent).toBe("My Project");
  });

  it("fills templates and skips opted-out and editable content", () => {
    document.body.innerHTML = `
      <span id="a">Uploading 3 / 10...</span>
      <span id="b" data-no-translate>Undo</span>
      <div contenteditable="true"><span id="c">Undo</span></div>`;
    applyDomTranslation("he");
    expect(document.getElementById("a")!.textContent).toBe("מעלה 3 / 10...");
    expect(document.getElementById("b")!.textContent).toBe("Undo");
    expect(document.getElementById("c")!.textContent).toBe("Undo");
    expect(translateUiText("Delete 4 projects?")).toBe("למחוק 4 פרויקטים?");
    expect(translateUiText("Compact density")).toBe("צפיפות: צפוף");
  });
});
