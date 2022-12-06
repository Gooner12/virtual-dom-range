import classes from "./RangeContainer.module.css";

function RangeContainer({
    rangeType, x, y, width, height, top, left, bottom, right
}) {
    return <>
        <div className={classes.container}>
            <h4>{rangeType}</h4>
            <div className={classes.value_container}>
            <p>X: <span>{x}</span></p>
            <p>Y: <span>{y}</span></p>
            <p>Height: <span>{height}</span></p>
            <p>Width: <span>{width}</span></p>
            <p>Top: <span>{top}</span></p>
            <p>Left: <span>{left}</span></p>
            <p>Bottom: <span>{bottom}</span></p>
            <p>Right: <span>{right}</span></p>
            </div>
        </div>
    </>
}

export default RangeContainer;