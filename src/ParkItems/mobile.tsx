/**
 * @file 手机端UI
 * @date 2022-12-20
 * @author xuejie.he
 * @lastModify xuejie.he 2022-12-20
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React from "react";
import { comms } from "..";
import ParkContainer from "../parkContainer";
import { ScrollComponent } from "../Scroll";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.FC = () => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/
    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    const rows = comms.config.options?.[0] ?? [];
    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className="mobileWrapper">
            <ScrollComponent
                className="mobileWrap"
                bodyClassName="mobile_scrollBody"
                hidden={{
                    y: true,
                }}
            >
                <div
                    className="mobile_parkMain"
                    style={{
                        width: `calc(calc(calc(100vw - 20px * 2 - 20px - 20px - 21px - 7px * 2) / 1.7) * ${
                            rows.length
                        } + ${rows.length ? rows.length - 1 : 0} * 20px )`,
                    }}
                >
                    {rows.map((item) => {
                        return (
                            <ParkContainer
                                key={item.code}
                                rowData={item}
                                className="mobile_parkContainer"
                            />
                        );
                    })}
                </div>
            </ScrollComponent>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
