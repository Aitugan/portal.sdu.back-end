import TokenService from "@/services/token";
import RolesService from "@/services/roles";
import { Response, NextFunction } from "express";
import { IRequestWithToken } from "@/@types";

export default () => {
  return (req: IRequestWithToken, res: Response, next: NextFunction) => {
    const parsed = TokenService.bearerParser(req);

    // has token
    if (parsed) {
      const token = TokenService.validate(parsed);

      // token is valid
      if (token) {
        const { ip, role_level } = token;
        const clientIp = req.clientIp;

        // same ip source
        if (ip === clientIp) {
          const isAuthorized = RolesService.authorize(role_level, req.originalUrl);

          // resource is available for the role
          if (isAuthorized) {
            req.token = token;
            return next();
          }
        }
      }

      // token is invalid || ip is invalid || resource is unavailable
      return res.status(403).send({
        status: false,
        message: "Unauthorized",
      });
    }

    // no token
    return res.status(401).send({
      status: false,
      message: "No Token presented",
    });
  };
};