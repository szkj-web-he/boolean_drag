/* <------------------------------------ **** DEPENDENCE IMPORT START **** ------------------------------------ */
/** This section will include all the necessary dependence for this tsx file */
import React from "react";
import { comms } from ".";
import { Drag } from "./Drag";
import { DragBox } from "./DragBox";
import { ScrollComponent } from "./Scroll";
import { OptionProps, PublicTempProps } from "./unit";
/* <------------------------------------ **** DEPENDENCE IMPORT END **** ------------------------------------ */
/* <------------------------------------ **** INTERFACE START **** ------------------------------------ */
/** This section will include all the interface for this tsx file */
interface TempProps extends PublicTempProps {
    values?: Array<OptionProps>;

    activeId?: string;
}

/* <------------------------------------ **** INTERFACE END **** ------------------------------------ */
/* <------------------------------------ **** FUNCTION COMPONENT START **** ------------------------------------ */
const Temp: React.FC<TempProps> = ({ activeId, handleDragMove, handleDragEnd, values }) => {
    /* <------------------------------------ **** STATE START **** ------------------------------------ */
    /************* This section will include this component HOOK function *************/

    /* <------------------------------------ **** STATE END **** ------------------------------------ */
    /* <------------------------------------ **** PARAMETER START **** ------------------------------------ */
    /************* This section will include this component parameter *************/

    /* <------------------------------------ **** PARAMETER END **** ------------------------------------ */
    /* <------------------------------------ **** FUNCTION START **** ------------------------------------ */
    /************* This section will include this component general function *************/

    /* <------------------------------------ **** FUNCTION END **** ------------------------------------ */
    return (
        <DragBox id="1" className={activeId ? "active" : ""}>
            <div className="parking_body">
                <div className="parking_head">
                    <span
                        className="headContent"
                        dangerouslySetInnerHTML={{ __html: comms.config.optionsInstruction ?? "" }}
                    />
                </div>

                <div className="parking_container">
                    <ScrollComponent
                        hidden={{
                            x: true,
                        }}
                    >
                        <div className="parking_content">
                            {values?.map((item) => {
                                return (
                                    <Drag
                                        key={item.code}
                                        handleDragMove={({ name }) => {
                                            handleDragMove({
                                                from: "1",
                                                data: { ...item },
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
                                                __html: item.content,
                                            }}
                                        />
                                    </Drag>
                                );
                            })}
                        </div>
                    </ScrollComponent>
                </div>
            </div>
        </DragBox>
    );
};
/* <------------------------------------ **** FUNCTION COMPONENT END **** ------------------------------------ */
export default Temp;
