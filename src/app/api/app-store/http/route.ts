'server only'

// import mongoose from 'mongoose'
// import { jwt2data } from '@/app/api/_model/sesion'

// const ALL_MONGOS = {
//     production: process.env.MONGODB_PRODUCTION || '',
//     preview: process.env.MONGODB_PREVIEW || '',
//     development: process.env.MONGODB_DEVELOPMENT || '',
// }
// const CURRENT_MONGO = ALL_MONGOS[process.env.NODE_ENV] || ALL_MONGOS.preview
const SESSION_SECRET = process.env.SESSION_SECRET || ''

// Imports
// ========================================================
import { NextResponse, type NextRequest } from 'next/server'
import { Resource } from 'sst'
// Config CORS
// ========================================================
/**
 *
 * @param origin
 * @returns
 */
const getCorsHeaders = (origin: string) => {
    // Default options
    const headers = {
        'Access-Control-Allow-Methods': `GET, POST, PUT, DELETE, OPTIONS`,
        'Access-Control-Allow-Headers': `Content-Type, Authorization, token`,
        'Access-Control-Allow-Origin': `${origin || '*'}`,
    }

    return headers
}

// ========================================================
// Endpoints
// ========================================================
/**
 * Basic OPTIONS Request to simuluate OPTIONS preflight request for mutative requests
 */
export const OPTIONS = async (request: NextRequest) => {
    // Return Response
    let origin = request.headers.get('origin') || ''

    console.log('origin', origin)

    return new Response('ok', {
        status: 200,
        headers: getCorsHeaders(origin),
    })
}

// let mongoosePromise = mongoose.connect(CURRENT_MONGO)

export async function GET(req: NextRequest, ctx: any) {
    return new Response(
        JSON.stringify({
            httpURL: Resource.RestAPI.url,
        }),
        {
            headers: getCorsHeaders(req.headers.get('origin') || '*'),
        },
    )
}

//
// import { jwt2data } from '@/app/api/_model/sesion'
// import { AppDesc } from '@/app/api/_model/ugcModels/AppDesc.model'
// import { AppListing } from '@/app/api/_model/systemModels/AppListing.model'

// const inbound = await req.json()

// const jwt = inbound.jwt

// // const params = await ctx.params
// console.log('jwt', jwt)

// // const collection = params.collection

// await mongoosePromise

// const data = await jwt2data({
//     secretKey: SESSION_SECRET,
//     payload: jwt,
// })

// if (!data || !data.username || !data.userID) {
//     return new Response('Unauthorized', {
//         status: 401,
//     })
// }

// let limit = inbound.limit || 25

// if (limit >= 100) {
//     limit = 100
// }

// if (limit <= 0) {
//     limit = 0
// }

// let listing = await AppListing.find({
//     ...inbound.query,
//     status: 'public',
// })
//     .limit(limit)
//     .skip(inbound.skip || 0)

// let dbResult = await AppDesc.find({
//     userID: data.userID,
//     _id: {
//         $in: listing.map((item) => item.appID),
//     },
// }).sort({
//     createdAt: -1,
// })

// let result = JSON.parse(JSON.stringify(dbResult))
