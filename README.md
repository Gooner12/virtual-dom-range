# Virtual Range

This is based on calculating the location or position of a selected text relative to the viewport. Getting a position can be achieved easily through Element.getBoundingClientRect(). In the case of a selected text, using a range for the selected text to get the bounding rectangle gives us the position. However, the range cannot be obtained for a text input element. So, a fake range is used to get the real position of a selected text contained inside a text input element.

The developed solution can be considered as an extension of [Rob W's solution](https://stackoverflow.com/questions/6930578/get-cursor-or-text-position-in-pixels-for-input-element/7948715#7948715), which does a good job of estimating the position of a selected text. However, the problem with that approach is that the position of a text in a multiline paragraph cannot be determined accurately. For selections made in a single-line text, positions can be obtained with fair accuracy with his approach.
 
## Implementation
Two elements, text input and div, are used to implement the solution.
Firstly, in the text input element, if the text is selected, then it will be covered by a div element, whose size and position are determined by the selected text. The virtual range is used to obtain the selected text position and size. Secondly, a true div element is used instead of the text input element as a "Selection Object" is available for the div element to get the real range. Then the positions obtained using the real range and the computed range are compared. Here, the range for a selected text inside a div element is compared with the virtual range generated for that div element for the same text.

## Demo of the virtual range
The below demo shows the implementation of the developed solution.
![](https://github.com/Gooner12/virtual-dom-range/blob/main/demo/Demo.gif)
