/**
 * @file desk的布局
 * @date 2022-12-20
 * @author xuejie.he
 * @lastModify xuejie.he 2022-12-20
 */
/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React from "react";
import { comms } from "../";
import ParkContainer from "../parkContainer";
import { useEffect } from "react";
import { useState } from "react";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.FC = () => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/
    const [width, setWidth] = useState<string>();
    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useEffect(() => {
        const fn = () => {
            //看看给多少尺寸合适

            const bodyWidth = document.documentElement.offsetWidth;
            //减padding值
            const val = bodyWidth - 20 * 2 - 20 - 21 - 7 * 2;

            /**
             * 理想值
             */
            const rows = comms.config.options?.[0] ?? [];

            let col = (rows.length > 10 ? 10 : rows.length) + 1;
            let sumWidth = 0;
            do {
                --col;
                sumWidth = 166 * col + (col - 1) * 20;
            } while (val < sumWidth && col > 1);
            if (col === 1) {
                setWidth(`calc(100vw - 20px * 2 - 20px - 21px - 7px * 2)`);
            } else {
                setWidth(
                    `calc(calc(100vw - 20px * 2 - 20px - 21px - 7px * 2 - ${
                        col - 1
                    } * 20px) / ${col})`,
                );
            }
        };
        fn();
        window.addEventListener("resize", fn);
        return () => {
            window.removeEventListener("resize", fn);
        };
    }, []);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    const rows = comms.config.options?.[0];
    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className="deskWrap">
            <div className="deskContainer">
                {rows?.map((item) => {
                    return <ParkContainer key={item.code} rowData={item} style={{ width }} />;
                })}
            </div>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
