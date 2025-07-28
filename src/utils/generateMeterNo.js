import { nanoid } from "nanoid";
import { checkMeterNumber } from "../db/db.store.js";

export const generateMeterNumber = async () => {
  let meterNumber;

  while (true) {
    meterNumber = "MTR" + nanoid(9); 
    const user = await checkMeterNumber(meterNumber);
    if (!user) {
      break;
    }
  }

  return meterNumber;
};
