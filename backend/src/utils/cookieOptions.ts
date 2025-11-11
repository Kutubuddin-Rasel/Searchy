import type { CookieOptions } from "express";

const isPod = process.env.NODE_ENV==="production";

export const accessTokenOptions:CookieOptions={
httpOnly:true,
secure:isPod,
sameSite:isPod?"none":"lax",
maxAge:Number(process.env.ACCESS_TOKEN_EXPIRY)
}

export const refreshTokenOptions:CookieOptions={
    httpOnly:true,
    secure:isPod,
    sameSite:isPod?"none":"lax",
    maxAge:Number(process.env.REFRESH_TOKEN_EXPIRY)
}