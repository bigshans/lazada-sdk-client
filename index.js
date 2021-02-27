const axios = require('axios');
const crypto = require('crypto');

function encryption(content, secret) {
    return crypto
        .createHmac('sha256', secret)
        .update(content, 'utf8')
        .digest('hex')
        .toUpperCase();
}

function sign(appSecret, api, params) {
    let keys = Object.keys(params);
    keys = keys.sort();
    const paramsStr = api + keys.map(k => `${k}${params[k]}`).join('');
    return encryption(paramsStr, appSecret);
}

/**
 *
 * @description lazada 请求类
 * @class
 */
class LazadaRequest {
    /**
   *
   * @constructor
   * @memberof LazadaRequest
   * @param {string} apiName api 名字
   * @param {string} htttpMethod 请求方法
   */
    constructor(apiName, htttpMethod = 'POST') {
        this.method = htttpMethod;
        this.apiName = apiName;
        this.params = {};
    }

    /**
   *
   * @description 添加参数
   * @param {string} key 键名
   * @param {object} value 键值
   * @memberof LazadaRequest
   */
    addApiParam(key, value) {
        this.params[key] = value;
    }

    /**
   *
   * @description 设置参数
   * @param {object} params 参数本身
   * @memberof LazadaRequest
   */
    setApiParam(params) {
        this.params = params;
    }

    /**
   * @typedef {
   * apiName: string,
   * method: string,
   * params: object,
   * } reqConfig
   */
    /**
   * @description 生成请求配置
   * @returns {reqConfig}
   * @memberof LazadaRequest
   */
    toConfig() {
        return {
            apiName: this.apiName,
            method: this.method,
            params: this.params,
        };
    }
}

/**
 *
 * @description lazada 客户端
 * @class
 */
class LazadaClient {
    /**
   *
   * @param {string} serverUrl 请求的 endpoint
   * @param {string} appKey app id
   * @param {string} appSecret app 密码
   * @param {number} timeout 请求超时时间
   * @constructor
   * @memberof LazadaRequest
   */
    constructor(serverUrl, appKey, appSecret, timeout = 30000) {
        this.serverUrl = serverUrl;
        this.appKey = appKey;
        this.appSecret = appSecret;
        this.timeout = timeout;
    }

    /**
   *
   * @description 请求 api
   * @param {LazadaRequest} 请求配置
   * @accessToken {string} 用户 token
   * @returns {AxiosPromise<AxiosResponse<Any>>}
   */
    execute(request, accessToken = null) {
        const timestamp = Date.now();
        let sysParameters = {
            app_key: this.appKey,
            sign_method: 'sha256',
            timestamp: timestamp,
            partner_id: 'lazop-sdk-python-20181207',
        };
        if (accessToken) {
            sysParameters['access_token'] = accessToken;
        }
        let requestConfig = request.toConfig();
        let signParameters = {
            ...sysParameters,
            ...requestConfig.params,
        };
        signParameters['sign'] = sign(
            this.appSecret,
            requestConfig.apiName,
            signParameters
        );
        if (requestConfig.method === 'POST') {
            console.log(this.serverUrl + requestConfig.apiName);
            return axios.post(this.serverUrl, {
                headers: {},
                data: signParameters,
                timeout: this.timeout,
            });
        }
        console.log(this.serverUrl + requestConfig.apiName);
        return axios.get(this.serverUrl + requestConfig.apiName, {
            params: signParameters,
            headers: {},
            timeout: this.timeout,
        });
    }
}

module.export = LazadaRequest;
module.export = LazadaClient;
