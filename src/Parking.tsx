/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React, { useEffect, useState } from "react";
import { comms } from ".";
import Desk from "./ParkItems/desk";
import Ipad from "./ParkItems/ipad";
import Mobile from "./ParkItems/mobile";
import { ParkingContext } from "./ParkItems/Unit/parkContext";
import { isMobile } from "./Scroll/Unit/useMobile";
import { isIpad, OptionProps, PublicTempProps } from "./unit";

/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
export interface TempProps extends PublicTempProps {
    values: Record<string, OptionProps | null>;

    activeId?: string;
}

/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.FC<TempProps> = ({ ...props }) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    const [mobileStatus, setMobileStatus] = useState(() => {
        const status = isMobile();
        if (status) {
            return !isIpad();
        }
        return false;
    });

    const [ipadStatus, setIpadStatus] = useState(() => {
        const status = isMobile();
        if (status) {
            return isIpad();
        }
        return false;
    });

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    useEffect(() => {
        const fn = () => {
            const status = isMobile();

            setMobileStatus(() => {
                if (status) {
                    return !isIpad();
                }
                return false;
            });

            setIpadStatus(() => {
                if (status) {
                    return isIpad();
                }
                return false;
            });
        };

        window.addEventListener("resize", fn);
        return () => {
            window.removeEventListener("resize", fn);
        };
    }, []);

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/
    const rows = comms.config.options?.[0] ?? [];
    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <div className="parking_wrap">
            <div className="parking_total">
                共<span className="parking_totalValue">{rows.length}</span>
                个分类
            </div>
            <ParkingContext.Provider
                value={{
                    ...props,
                }}
            >
                {mobileStatus ? <Mobile /> : ipadStatus ? <Ipad /> : <Desk />}
            </ParkingContext.Provider>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
