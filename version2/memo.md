# メモ

## WebSocket

### 実装方針

- API Gateway + Lambda + DynamoDB でWebSocket処理を実装する
    - https://docs.aws.amazon.com/apigateway/latest/developerguide/websocket-api-chat-app.html
    - API Gatewayは無料枠で利用可能
    - 他もオンデマンド課金なので、ほぼ無料でWebSocketを実装できる

- Cloudflare Durable Objectsも利用できるがWorkersの有料プラン($5/month)が必要

### DyanaoDB

- 接続IDをキーにして接続情報を保存する
- ルームIDを持たせて検索できるようにする

## メディア

- ひとまず音声/動画共に普通にS3に保存する
    - 音声はPartial Contentに対応しているので問題なく再生できる
    - 動画はどうなっているかわからないので検証
- 動画は重そうなら低ビットレートにエンコードしたい
