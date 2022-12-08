const jwt = require("jsonwebtoken");
const crypto = require("crypto");

module.exports.checkToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(" ")[1];

        if (token == null) {
            return res.status(401).json({
                status: "error",
                message: "accessToken does not exist"
            });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decoded) {
            return res.status(403).json({
                status: "error",
                message: "cannot decode accessToken"
            });
        }

        let fph1 = decoded.fingerprintHash;
        let fph2 = crypto.createHash("sha256").update(req.cookies["fingerprint"]).digest("hex");

        if (fph1 != fph2) {
            return res.status(403).json({
                status: "error",
                message: "fingerprint not match"
            });
        }

        next();
    } else {
        res.status(401).json({
            status: "error",
            message: "auth header does not exist"
        });
    }
}