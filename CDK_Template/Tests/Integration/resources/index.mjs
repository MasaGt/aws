/**
 * HTTP API のレスポンス形式2.0を採用
 * → https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html?utm_source=chatgpt.com
 * @param {*} event ユーザーから送られてくるデータ
 * @param {*} context 実行時の環境情報
 * @returns レスポンスボディに設定する文字列 (Hello From Lambda)
 */
export const handler = async(event, context) => {
    return "Hello From Lambda";
};