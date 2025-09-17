/**
 * 認証関数 (REQUESTオーソライザー)
 * 呼び出し元から渡されるユーザーIDでDynamoユーザーテーブルに検索をかる
 * → hitしたらOK、hitしなかったら401エラー
 * @param {*} event 呼び出し元から渡されるデータ
 * @param {*} context Lambda の 実行環境に関する情報を持つオブジェクト
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

//ダイナモDBクライアントの作成
const client= new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const handler = async(event, context) => {
    
    //IAMポリシー形式のレスポンス
    // let response = {
    //     "principalId": "test",
    //     "policyDocument": {
    //         "Version": "2012-10-17",
    //         "Statement": [
    //             {
    //                 "Action": "execute-api:Invoke",
    //                 "Effect": "Deny",
    //                 "Resource": event.version === '1.0' ? event.methodArn : event.routeArn
    //             }
    //         ]
    //     }
    // }

    //SIMPLE形式のレスポンス
    let response = {
        isAuthorized: false,
    };

    console.log("↓イベントログ"); 
    console.log(event);
    //認可ヘッダーを取得
    console.log("↓ヘッダー");
    console.log(event.headers);
    
    const auth = event.headers["Auth"] || event.headers["auth"];
    // console.log("↓取得した認可ヘッダー");
    console.log(auth);
    
    let userID = event.queryStringParameters?.user_id;
    console.log("↓クエリパラメーター");
    console.log(userID);

    //認可ヘッダーにallowが設定されていない もしくは クエリパラメーターにユーザーIDがなければ401エラー
    if (auth !== "Allow" || !userID) {
        return response;
    }
    
    //データ取得
    console.log("↓テーブル名")
    console.log(process.env.TABLE_NAME);
    const result = await ddbDocClient.send(
        new GetCommand({
            TableName: process.env.TABLE_NAME,
            Key: {
                user_id: userID
            }
        })
    );

    console.log("-------------------↓検索結果-------------------");
    console.log(result);

    // console.log("↓取得したItem");
    // console.log(result.Item);

    //送られてきたユーザーIDがhitした場合は200
    if (result.Item) {
        // response.policyDocument.Statement[0].Effect = "Allow"
        response.isAuthorized = true;
    }

    console.log("↓レスポンス");
    console.log(response);
    // console.log("↓レスポンス.policyDocument");
    // console.log(response.policyDocument);
    // console.log("↓レスポンス.policyDocument.statement");
    // console.log(response.policyDocument.Statement[0]);
    return response;
};

