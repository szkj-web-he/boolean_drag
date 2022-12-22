/**
 * @file 每个小篮子
 * @date 2022-12-20
 * @author xuejie.he
 * @lastModify xuejie.he 2022-12-20
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React from "react";
import { Drag } from "./Drag";
import { DragBox } from "./DragBox";
import { useParkingContext } from "./ParkItems/Unit/parkContext";
import { ScrollComponent } from "./Scroll";
import { OptionProps } from "./unit";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
interface TempProps {
    style?: React.CSSProperties;

    className?: string;

    rowData: OptionProps;
}
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.FC<TempProps> = ({ style, className, rowData }) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    const { values, activeId, handleDragMove, handleDragEnd } = useParkingContext();

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    const colData = values[rowData.code];

    const classList = ["parkContainer"];
    className && classList.push(className);

    activeId === rowData.code && classList.push("active");
    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <DragBox className={classList.join(" ")} id={rowData.code} style={style}>
            <div className="parkName">
                <span
                    dangerouslySetInnerHTML={{
                        __html: rowData.content,
                    }}
                />
            </div>
            <div className="parkContent">
                <ScrollComponent
                    hidden={{
                        x: true,
                    }}
                >
                    <div className="parkContent_itemList">
                        {colData && (
                            <Drag
                                key={colData.code}
                                handleDragMove={({ name }) => {
                                    handleDragMove({
                                        from: rowData.code,
                                        data: { ...colData },
                                        to: name,
                                    });
                                }}
                                activeClassName="gray"
                                className={"selectOption"}
                                handleDragEnd={handleDragEnd}
                            >
                                <span
                                    className="dragContent"
                                    dangerouslySetInnerHTML={{
                                        __html: colData.content,
                                    }}
                                />
                            </Drag>
                        )}
                    </div>
                </ScrollComponent>
            </div>
        </DragBox>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
