const crypto = require("crypto");

module.exports.generateFpAndFpHash = function () {
    const fingerprint = crypto.randomBytes(50).toString("hex");
    const fingerprintHash = crypto.createHash("sha256").update(fingerprint).digest("hex");

    return {
        fingerprint: fingerprint,
        fingerprintHash: fingerprintHash
    }
}