import { createContext, useContext } from "react";

import { TempProps as ParkProps } from "../../Parking";

const defaultParkingData = (): ParkProps => {
    return {
        values: {},
        activeId: undefined,
        handleDragMove: () => undefined,
        handleDragEnd: () => undefined,
    };
};

export const ParkingContext = createContext(defaultParkingData());

export const useParkingContext = (): ParkProps => useContext(ParkingContext);
