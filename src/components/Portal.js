import ReactDOM from "react-dom";

// document.body is the place where we want to place the children props
function Portal(props) {
    return (
        ReactDOM.createPortal(props.children, document.body)
    );
}

export default Portal;