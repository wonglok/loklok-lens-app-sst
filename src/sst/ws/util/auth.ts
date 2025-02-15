import { SignJWT, jwtVerify } from 'jose'

export async function encrypt(payload: any, secretKey: string) {
    const encodedKey = new TextEncoder().encode(secretKey)

    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('500 years')
        .sign(encodedKey)
}

export async function decrypt(str: string, secretKey: string) {
    const encodedKey = new TextEncoder().encode(secretKey)

    try {
        const { payload } = await jwtVerify(`${str}`, encodedKey, {
            // algorithms: ["HS256"],
        })
        return payload
    } catch (error) {
        console.log(error, 'Failed to verify session')
    }
}

export async function jwt2data({ payload, secretKey }: { payload: string; secretKey: string }) {
    const data: any = await decrypt(payload, secretKey)
    return data
}

export async function data2jwt({ payload, secretKey }: { payload: string; secretKey: string }) {
    const jwt: string = await encrypt(payload, secretKey)
    return jwt
}

export async function jwt2jwtRefreshed({ jwt, secretKey }: { jwt: string; secretKey: string }) {
    const payload = await decrypt(jwt, secretKey)

    const jwt2 = await encrypt(payload, secretKey)
    return jwt2
}
