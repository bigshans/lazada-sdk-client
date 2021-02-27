# (WIP)lazada-sdk-client

This project is imitated from the Python SDK version. You can use it like python sdk.

## How to use?

```javascript
const { LazadaRequest, LazadaClient } = require('lazada-sdk-client');

const client = new LazadaClient('${you server api}', '${you api key}', '${you api secret}', '${timeout}'); // default timeout is 30000
const request = new LazadaRequest('${you request api endpoint}', '${http method}'); // http method default is post
request.addApiParam('${key}', '${value}');
const res = await client.execute(request, token); // the return is AxiosResponse
```

It works on normal API. I have not yet written the handling of the file upload interface.

