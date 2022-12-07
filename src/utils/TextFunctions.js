export const getSelectedText = (removeRange) => {
  const selection = window.getSelection();
  // removing the targeted range that was used on mouseDown event
  if (removeRange) {
    selection.removeAllRanges();
    return null;
  }
  if (window.getSelection().toString()) {
    const range = selection.getRangeAt(0);
    selection.removeAllRanges();
    selection.addRange(range);
    return [range.toString(), range, selection];
  }
  return [null, null, null];
};

export const getSelectedTextInput = (element, startPosition, endPosition) => {
  if (
    element.tagName === "TEXTAREA" ||
    (element.tagName === "INPUT" && element.type === "text")
  ) {
    return element.value.substring(startPosition, endPosition);
  }
  return null;
};

export function getTextInputBoundingRect(
  input,
  selectionStart,
  selectionEnd,
  nonInputElement,
  debug
) {
  // Basic parameter validation
  if (!nonInputElement) {
    if (!input || !("value" in input)) return input;
    if (typeof selectionStart == "string")
      selectionStart = parseFloat(selectionStart);
    if (typeof selectionStart != "number" || isNaN(selectionStart)) {
      selectionStart = 0;
    }
    if (selectionStart < 0) selectionStart = 0;
    else selectionStart = Math.min(input.value.length, selectionStart);
    if (typeof selectionEnd == "string")
      selectionEnd = parseFloat(selectionEnd);
    if (
      typeof selectionEnd != "number" ||
      isNaN(selectionEnd) ||
      selectionEnd < selectionStart
    ) {
      selectionEnd = selectionStart;
    }
    if (selectionEnd < 0) selectionEnd = 0;
    else selectionEnd = Math.min(input.value.length, selectionEnd);
  }

  // If available (thus IE), use the createTextRange method
  if (typeof input.createTextRange == "function") {
    const range = input.createTextRange();
    range.collapse(true);
    range.moveStart("character", selectionStart);
    range.moveEnd("character", selectionEnd - selectionStart);
    return range.getBoundingClientRect();
  }
  // generating a range from virtual identical text element
  const offset = getInputOffset();
  let topPosition = offset.top,
    leftPosition = offset.left;
  const width = getInputCSS("width", true),
    height = getInputCSS("height", true);

  // Styles to simulate a node in an input field
  let cssDefaultStyles = "white-space:pre;padding:0;margin:0;";
  const listOfModifiers = [
    "direction",
    "font-family",
    "font-size",
    "font-size-adjust",
    "font-variant",
    "font-weight",
    "font-style",
    "letter-spacing",
    "line-height",
    "text-align",
    "text-indent",
    "text-transform",
    "word-wrap",
    "word-spacing",
  ];

  // adjusting the positions based on the applied css values for following properties
  topPosition += getInputCSS("padding-top", true);
  topPosition += getInputCSS("border-top-width", true);
  leftPosition += getInputCSS("padding-left", true);
  leftPosition += getInputCSS("border-left-width", true);

  for (const i in listOfModifiers) {
    const property = listOfModifiers[i];
    cssDefaultStyles += property + ":" + getInputCSS(property) + ";";
  }
  // End of CSS variable checks
  let text;
  if (nonInputElement) text = input.textContent;
  else text = input.value;
  const fakeClone = document.createElement("div");

  // applying the css property that has been applied to the original text to the virtual div
  fakeClone.style.cssText = cssDefaultStyles;

  // positioning the text inside a virtual div to the original text's position along with wrapping
  fakeClone.style.position = "absolute";
  fakeClone.style.top = topPosition + "px";
  fakeClone.style.left = leftPosition + "px";
  fakeClone.style.width = width + "px";
  fakeClone.style.height = height + "px";
  fakeClone.style.whiteSpace = "pre-wrap";
  fakeClone.textContent = text;

  document.body.appendChild(fakeClone);

  if (nonInputElement) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.setStart(fakeClone.firstChild, selection.anchorOffset);
    range.setEnd(fakeClone.firstChild, selection.focusOffset);
    const virtualRange = range.getBoundingClientRect();
    if (!debug) fakeClone.parentNode.removeChild(fakeClone); // removing the virtual element
    return virtualRange;
  }

  // creating a range for the selected text
  const range = document.createRange();
  range.setStart(fakeClone.firstChild, selectionStart);
  range.setEnd(fakeClone.firstChild, selectionEnd);
  const virtualRange = range.getBoundingClientRect();

  if (!debug) fakeClone.parentNode.removeChild(fakeClone); // removing the virtual element
  return virtualRange;

  // Computing offset position
  function getInputOffset() {
    const body = document.body,
      windowObject = document.defaultView,
      documentElement = document.documentElement;
    let box = document.createElement("div");
    box.style.paddingLeft = box.style.width = "1px";
    body.appendChild(box);
    const isBoxModel = box.offsetWidth === 2;
    body.removeChild(box);
    box = input.getBoundingClientRect();
    const clientTop = documentElement.clientTop || body.clientTop || 0,
      clientLeft = documentElement.clientLeft || body.clientLeft || 0,
      scrollTop =
        windowObject.pageYOffset ||
        (isBoxModel && documentElement.scrollTop) ||
        body.scrollTop,
      scrollLeft =
        windowObject.pageXOffset ||
        (isBoxModel && documentElement.scrollLeft) ||
        body.scrollLeft;
    return {
      top: box.top + scrollTop - clientTop,
      left: box.left + scrollLeft - clientLeft,
    };
  }
  function getInputCSS(property, isNumber) {
    const value = document.defaultView
      .getComputedStyle(input, null)
      .getPropertyValue(property);
    return isNumber ? parseFloat(value) : value;
  }
}
