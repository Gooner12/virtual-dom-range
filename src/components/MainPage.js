import classes from "./MainPage.module.css";
import { useState, useRef } from "react";
import {
  getSelectedTextInput,
  getSelectedText,
  getTextInputBoundingRect,
} from "../utils/TextFunctions";
import RangeContainer from "./RangeContainer";

function MainPage() {
  const [textValue, setTextValue] = useState("");
  const [originalValues, setOriginalValues] = useState({}),
    [generatedValues, setGeneratedValues] = useState({});
  const textRef = useRef();

  const changeHandler = (event) => {
    setTextValue(event.currentTarget.value);
  };

  const insertBlock = (event) => {
    const element = event.target;
    const text = getSelectedTextInput(
      element,
      element.selectionStart,
      element.selectionEnd
    );
    if (text) {
      const range = getTextInputBoundingRect(
        element,
        element.selectionStart,
        element.selectionEnd,
        false
      );
      const hidingBlock = document.createElement("div");
      hidingBlock.setAttribute("id", "generated_id");
      hidingBlock.style.position = "absolute";
      hidingBlock.style.top = range.top + "px";
      hidingBlock.style.left = range.left + "px";
      hidingBlock.style.width = range.width + "px";
      hidingBlock.style.height = range.height + "px";
      hidingBlock.style.backgroundColor = "var(--highlight-color)";

      document.body.appendChild(hidingBlock);
    }
  };

  const removeBlock = (event) => {
    const element = event.target;
    element.selectionStart = element.value.length;
    element.selectionEnd = element.value.length;
    const existingBlock = document.getElementById("generated_id");
    if (existingBlock) document.body.removeChild(existingBlock);
  };

  const showRanges = (event) => {
    const element = event.target;
    const [text, range] = getSelectedText();
    if (text) {
      var virtualRange = getTextInputBoundingRect(element, null, null, true);
    }
    if (range && virtualRange) {
      const tempOriginalValues = range.getBoundingClientRect().toJSON();
      setOriginalValues({ ...tempOriginalValues });
      const tempGeneratedValues = virtualRange.toJSON();
      setGeneratedValues({ ...tempGeneratedValues });
    }
  };

  const removeRange = () => {
    getSelectedText(true);
  };

  return (
    <>
      <h2 className={classes.title}>Range Comparison</h2>
      <div className={classes.main_container}>
        <div className={classes.original_range_container}>
          <RangeContainer rangeType="Original Range" {...originalValues} />
        </div>
        <div className={classes.text_container}>
          <div className={classes.input_text}>
            <div>Input text:</div>
            <textarea
              id="text_field"
              rows={4}
              cols={80}
              ref={textRef}
              value={textValue}
              onChange={changeHandler}
              onMouseUp={(event) => insertBlock(event)}
              onMouseDown={(event) => removeBlock(event)}
            />
          </div>
          <div className={classes.div_text}>
            <div>Div text:</div>
            <div
              className={classes.content_editable_text_field}
              contentEditable
              ref={textRef}
              value={textValue}
              onChange={changeHandler}
              onMouseUp={(event) => showRanges(event)}
              onMouseDown={removeRange}
            />
          </div>
        </div>
        <div className={classes.virtual_range_container}>
          <RangeContainer rangeType="Generated Range" {...generatedValues} />
        </div>
      </div>
    </>
  );
}

export default MainPage;
