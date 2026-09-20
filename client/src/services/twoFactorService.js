import axiosClient from "@/lib/axiosClient";

export async function setupTwoFactorRequest() {
    const { data } = await axiosClient.post("/auth/2fa/setup");
    return data;
}

export async function verifyTwoFactorSetupRequest(token) {
    const { data } = await axiosClient.post("/auth/2fa/verify", { token });
    return data;
}

export async function disableTwoFactorRequest(password, token) {
    const { data } = await axiosClient.post("/auth/2fa/disable", { password, token });
    return data;
}