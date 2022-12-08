const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const express = require("express");
const router = express.Router();

const User = require("../models/user");
const helper = require("../helpers/helper");

router.post("/login", async function (req, res, next) {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            return res.status(401).json({
                status: "error",
                message: "user not found",
                token: false
            });
        }

        const passValid = await bcrypt.compare(password, existingUser.password);

        if (passValid) {
            const { fingerprint, fingerprintHash } = helper.generateFpAndFpHash();

            res.cookie("fingerprint", fingerprint, {
                httpOnly: true,
                maxAge: 60 * 60 * 8,
                secure: true
            });

            const accessToken = jwt.sign({
                _id: existingUser._id,
                fingerprintHash: fingerprintHash
            }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRATION
            });

            const refreshToken = jwt.sign({
                _id: existingUser._id,
                fingerprintHash: fingerprintHash
            }, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRATION
            });

            await User.findOneAndUpdate({
                _id: existingUser._id
            }, {
                $set: {
                    refreshToken: refreshToken
                }
            });

            return res.status(200).json({
                status: "ok",
                message: "password match",
                accessToken: "Bearer " + accessToken,
                refreshToken: "Bearer " + refreshToken
            });
        } else {
            return res.status(401).json({
                status: "error",
                message: "invalid password",
                token: false
            });
        }
    } catch (err) {
        console.log(err.message);

        return res.status(500).json({
            status: "error",
            message: "server error: " + err.message,
            token: false
        });
    }
});

router.post("/register", async function (req, res, next) {
    const { email, password, repeatPassword } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(401).json({
                status: "error",
                message: "user already exist",
                user: false
            });
        }

        const passMatch = password == repeatPassword;

        if (!passMatch) {
            return res.status(401).json({
                status: "error",
                message: "password does not match",
                user: false
            });
        }

        const salt = await bcrypt.genSalt();
        const tpass = await bcrypt.hash(password, salt);

        let user = new User({
            email: email,
            password: tpass
        });

        await user.save();

        return res.status(200).json({
            status: "ok",
            message: "user created",
            user: user
        });
    } catch (err) {
        console.log(err.message);

        return res.status(500).json({
            status: "error",
            message: "server error: " + err.message,
            user: false
        });
    }
});

router.put("/logout", async function (req, res, next) {
    const { refreshToken } = req.body;

    try {
        if (!refreshToken) {
            return res.status(401).json({
                status: "error",
                message: "refreshToken does not exist",
                user: false
            });
        }

        const existingUser = await User.findOne({ refreshToken: refreshToken });

        if (!existingUser) {
            return res.status(401).json({
                status: "error",
                message: "user not exist",
                user: false
            });
        }

        existingUser.refreshToken = null;
        await existingUser.save();

        return res.status(200).json({
            status: "ok",
            message: "logout success",
            user: existingUser
        });
    } catch (err) {
        console.log(err.message);

        return res.status(500).json({
            status: "error",
            message: "server error: " + err.message,
            user: false
        });
    }
});

router.post("/token", async function (req, res, next) {
    const { refreshToken } = req.body;

    try {
        if (!refreshToken) {
            console.log("refreshToken does not exist");

            return res.status(401).json({
                status: "error",
                message: "refreshToken does not exist",
                accessToken: false
            });
        }

        const existingUser = await User.findOne({ refreshToken: refreshToken });

        if (!existingUser) {
            console.log("user not exist");

            return res.status(401).json({
                status: "error",
                message: "user not exist",
                accessToken: false
            });
        }

        try {
            try {
                const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

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
            } catch (err) {
                console.log(err)

                return res.status(403).json({
                    status: "error",
                    message: err.message,
                    accessToken: false
                });
            }

            const { fingerprint, fingerprintHash } = helper.generateFpAndFpHash();

            res.cookie("fingerprint", fingerprint, {
                httpOnly: true,
                maxAge: 60 * 60 * 8,
                secure: true
            });

            const accessToken = jwt.sign({
                _id: existingUser._id,
                fingerprintHash: fingerprintHash
            }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRATION
            });

            const refreshToken1 = jwt.sign({
                _id: existingUser._id,
                fingerprintHash: fingerprintHash
            }, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRATION
            });

            await User.findOneAndUpdate({
                _id: existingUser._id
            }, {
                $set: {
                    refreshToken: refreshToken1
                }
            });

            return res.status(200).json({
                status: "ok",
                message: "access token generated successfully",
                accessToken: "Bearer " + accessToken,
                refreshToken: "Bearer " + refreshToken1,
            });
        }
        catch (err) {
            console.log(err.message);

            return res.status(500).json({
                status: "error",
                message: "server error: " + err.message,
                accessToken: false
            });
        }


    } catch (err) {
        console.log(err.message);

        return res.status(500).json({
            status: "error",
            message: "server error: " + err.message,
            accessToken: false
        });
    }
});
module.exports = router;