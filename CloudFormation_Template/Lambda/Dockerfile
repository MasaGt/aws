# Lambda 関数の元となるDockerイメージを作成するDockerfile

# AWS が提供している Node.js 用のベースイメージ
FROM public.ecr.aws/lambda/nodejs:22

# 関数の中身をCOPYでイメージ内に移動
COPY ./init.js ${LAMBDA_TASK_ROOT}

# 実行コマンドの引数として、エントリーポイントとなる関数handlerを渡す
CMD [ "init.handler" ]