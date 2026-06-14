"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function setCookies(data: {
    accessToken: string;
}) {
    const cookieStore = await cookies();

    cookieStore.set("access_token", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
    });
}

export async function clearAuthCookies(customRedirect?: boolean) {
    const cookieStore = await cookies();

    const allCookies = cookieStore.getAll();

    for (const cookie of allCookies) {
        cookieStore.delete(cookie.name);
    }

    if (!customRedirect) {
        redirect("/");
    }
}


export async function getAccessToken() {
    const cookieStore = await cookies();
    return cookieStore.get("access_token")?.value;
}