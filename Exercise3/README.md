Stack Trace in V3 SDK

This exercise will take a peek at how V3 SDK's stack trace is different
from v2: 

Using v2, call a service with invalid parameters like:

```javascript
const DynamoDB = require('aws-sdk/clients/dynamodb');
const client = new DynamoDB({region: 'us-west-2'});
const request = client.putItem({TableName: 'FakeName', Item: {
    Foo: {S: 'Foo'}
}});
request.send((err, data) => {
    console.log(err)
})
```

The stack trace will look like:
```
ResourceNotFoundException: Requested resource not found
    at Request.extractError (XXX/node_modules/aws-sdk/lib/protocol/json.js:51:27)
    at Request.callListeners (XXX/node_modules/aws-sdk/lib/sequential_executor.js:106:20)
    at Request.emit (XXX/node_modules/aws-sdk/lib/sequential_executor.js:78:10)
    at Request.emit (XXX/node_modules/aws-sdk/lib/request.js:683:14)
    at Request.transition (XXX/node_modules/aws-sdk/lib/request.js:22:10)
    at AcceptorStateMachine.runTo (XXX/node_modules/aws-sdk/lib/state_machine.js:14:12)
    at XXX/node_modules/aws-sdk/lib/state_machine.js:26:10
    at Request.<anonymous> (XXX/node_modules/aws-sdk/lib/request.js:38:9)
    at Request.<anonymous> (XXX/node_modules/aws-sdk/lib/request.js:685:12)
    at AcceptorStateMachine.runTo (XXX/node_modules/aws-sdk/lib/state_machine.js:14:12)
    at XXX/node_modules/aws-sdk/lib/state_machine.js:26:10
    at Request.<anonymous> (XXX/node_modules/aws-sdk/lib/request.js:38:9)
    at Request.<anonymous> (XXX/node_modules/aws-sdk/lib/request.js:685:12)
    at AcceptorStateMachine.runTo (XXX/node_modules/aws-sdk/lib/state_machine.js:14:12)
    at XXX/node_modules/aws-sdk/lib/state_machine.js:26:10
    at Request.<anonymous> (XXX/node_modules/aws-sdk/lib/request.js:38:9)
    at Request.<anonymous> (XXX/node_modules/aws-sdk/lib/request.js:685:12)
    at Request.callListeners (XXX/node_modules/aws-sdk/lib/sequential_executor.js:116:18)
```

Sometimes `Request.transition` exists multiple times as the SDK state machine stuck at some 
state and makes stack trace unreadable.

However in V3 lets call a similar operation:

```
const {DynamoDBClient, PutItemCommand} = require('@aws-sdk/client-dynamodb-node');
const client = new DynamoDBClient({region: 'us-west-2'});
const command = new PutItemCommand({TableName: 'FakeName', Item: {
    Foo: {S: 'Foo'}
}});
(async () => {
    try {
        await client.send(command);
    } catch(e) {
        console.log(e);
        throw e;
    }
})()
```

The stack trace will look like:

```
ResourceNotFoundException: Requested resource not found
    at JsonRpcParser.exports.jsonErrorUnmarshaller [as parseServiceException] (XXX/node_modules/@aws-sdk/json-error-unmarshaller/build/index.js:37:70)
    at JsonRpcParser.<anonymous> (XXX/node_modules/@aws-sdk/protocol-json-rpc/build/JsonRpcParser.js:22:40)
    at step (XXX/node_modules/tslib/tslib.js:136:27)
    at Object.next (XXX/node_modules/tslib/tslib.js:117:57)
    at fulfilled (XXX/node_modules/tslib/tslib.js:107:62)
    at process._tickCallback (internal/process/next_tick.js:68:7)
```

The V3 SDK uses middleware, you won't see annoying repeated `Request.transition`.