export default () => ({
    token: {
        client_id: process.env.API_ID,
        client_secret: process.env.API_SECRET,
        url: process.env.TOKEN_URL
    },
    api: {
        url: process.env.API_URL,
        endpoint: 'findByPeriod'
    },
    sqs: {
        accessKeyId: process.env.SQS_ID,
        secretAccessKey: process.env.SQS_SECRET,
        queueUrl: process.env.SQS_URL,
        region: 'us-east-2',
        endpoint: process.env.SQS_ENDPOINT
    }
});