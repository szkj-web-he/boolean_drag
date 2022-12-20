/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */

import React from "react";
import { comms } from ".";
import { Drag } from "./Drag";
import { ScrollComponent } from "./Scroll";
import { PublicTempProps } from "./unit";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */

/** This section will include all the interface for this tsx file */

/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
export const Warehouse: React.FC<PublicTempProps> = ({ handleDragMove, handleDragEnd }) => {
    const arr = comms.config.options?.[1] ?? [];

    const content = (
        <div className="warehouse_body">
            {arr.map((item) => {
                return (
                    <Drag
                        key={item.code}
                        activeClassName="gray"
                        handleDragMove={({ name }) => {
                            handleDragMove({
                                data: { ...item },
                                to: name,
                            });
                        }}
                        className="dragItem"
                        handleDragEnd={handleDragEnd}
                        handleDragCancel={handleDragEnd}
                        portalClassName="dragPortal"
                    >
                        <span
                            className="dragContent"
                            dangerouslySetInnerHTML={{
                                __html: item.content,
                            }}
                        />
                    </Drag>
                );
            })}
        </div>
    );

    return (
        <div className="warehouse_wrap">
            <div className="warehouse_total">
                共
                <span className={`warehouse_totalVal${arr.length ? "" : " red"}`}>
                    {arr.length}
                </span>
                项
            </div>

            <ScrollComponent
                className="warehouse_scrollWrap"
                bodyClassName="warehouse_scrollBody"
                hidden={{
                    x: true,
                }}
            >
                {content}
            </ScrollComponent>
        </div>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
