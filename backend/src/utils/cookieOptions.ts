import type { CookieOptions } from "express";
const isPod = process.env.NODE_ENV==="production";

export const accessTokenOptions:CookieOptions={
httpOnly:true,
secure:isPod,
sameSite:isPod?"none":"lax",
maxAge:15*60*1000
}

export const refreshTokenOptions:CookieOptions={
    httpOnly:true,
    secure:isPod,
    sameSite:isPod?"none":"lax",
    maxAge:7 * 24 * 60 * 60 * 1000
}