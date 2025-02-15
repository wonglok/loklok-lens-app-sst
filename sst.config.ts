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

        const wss = new sst.aws.ApiGatewayWebSocket('SocketAPI')
        const getRealtimeLinks = () => [ConnectionsTable, wss]

        const SESSION_SECRET = new sst.Secret('SESSION_SECRET')

        const environment = {
            SESSION_SECRET: SESSION_SECRET.value,
            SocketAPI: wss.url,
        }

        let nextjs = new sst.aws.Nextjs('MyWeb', {
            environment: environment,
            link: [...getRealtimeLinks()],
            domain: {
                name: 'lens.loklok.land',
            },
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
