import { Message } from "@aws-sdk/client-sqs";
import { SqsConsumerEventHandler, SqsMessageHandler, SqsService } from "@ssut/nestjs-sqs";
import { Injectable } from "@nestjs/common";
// import * as AWS from '@aws-sdk/client-sqs';

@Injectable()
export class AutoserviceConsumer {
    constructor() {}

    @SqsMessageHandler('autoservice', false)
    async handleMessage(message: Message) {
        console.log(message);
    }
}