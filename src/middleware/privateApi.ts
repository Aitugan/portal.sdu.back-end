import * as cors from "cors";

export default () => {
  return cors({
    origin: "http://localhost:3000",
  });
};
