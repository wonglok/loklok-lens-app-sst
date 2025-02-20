// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
    app(input) {
        return {
            name: 'loklok-lens-app-sst',
            removal: input?.stage === 'production' ? 'retain' : 'remove',
            protect: ['production'].includes(input?.stage),
            home: 'aws',
        }
    },
    async run() {
        const ConnectionsTable = new sst.aws.Dynamo('ConnectionsTable', {
            fields: {
                itemID: 'string',
            },
            primaryIndex: { hashKey: 'itemID' },
        })

        const appDataBucket = new sst.aws.Bucket('AppDataBucket', {
            access: 'public',
            cors: {
                allowHeaders: ['*'],
                allowOrigins: ['*'],
                allowMethods: ['DELETE', 'GET', 'HEAD', 'POST', 'PUT'],
                exposeHeaders: ['E-Tag'],
                maxAge: '3600 seconds',
            },
        })

        const appDataCDN = new sst.aws.Router('AppDataCDN', {
            routes: {
                '/*': {
                    bucket: appDataBucket,
                },
                //
                // '/bucket/*': {
                //     bucket: myUGCBucket,
                // },
                //
            },
        })

        //

        const wss = new sst.aws.ApiGatewayWebSocket('SocketAPI')

        const SESSION_SECRET = new sst.Secret('SESSION_SECRET')

        const api = new sst.aws.ApiGatewayV2('RestAPI')

        const environment = {
            CURRENT_STAGE: $app.stage,
            SESSION_SECRET: SESSION_SECRET.value,
            SocketAPI: wss.url,
        }
        let domain = {
            name: 'lens.loklok.land',
        }

        if ($app.stage === 'preview') {
            domain = {
                name: 'lens-preview.loklok.land',
            }
        }

        const getRealtimeLinks = () => [ConnectionsTable, wss, api]

        api.route('POST /api/files/signGenericFile', {
            link: [appDataBucket, appDataCDN, api],
            environment: environment,
            handler: 'src/sst/http/files/files.signGenericFile',
        })
        api.route('POST /api/files/removeUserGenericFile', {
            link: [appDataBucket, appDataCDN, api],
            environment: environment,
            handler: 'src/sst/http/files/files.removeUserGenericFile',
        })
        api.route('GET /api/files/getFileLink', {
            link: [appDataBucket, appDataCDN, api],
            environment: environment,
            handler: 'src/sst/http/files/files.getFileLink',
        })

        let nextjs = new sst.aws.Nextjs('MyWeb', {
            environment: environment,
            link: [...getRealtimeLinks()],
            domain: domain,
        })

        wss.route('$connect', {
            handler: 'src/sst/ws/connect.handler',
            link: [...getRealtimeLinks()],
            environment: environment,
        })

        wss.route('$disconnect', {
            handler: 'src/sst/ws/disconnect.handler',
            link: [...getRealtimeLinks()],
            environment: environment,
        })

        wss.route('$default', {
            handler: 'src/sst/ws/default.handler',
            link: [...getRealtimeLinks()],
            environment: environment,
        })

        return { nextjs: nextjs.url }
    },
})
