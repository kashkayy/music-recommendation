import { useState, useCallback } from "react";
import { MODE } from "../utils/constants";
export default function useMapSwitch() {
  const [currMode, setCurrMode] = useState(MODE.LIVE);
  const handleClick = useCallback(
    (mode) => {
      setCurrMode(mode);
    },
    [setCurrMode]
  );
  return { handleClick, currMode };
}
