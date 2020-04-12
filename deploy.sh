#!/bin/bash

echo $BRANCH
npm install
npm run lint
if [ $BRANCH == "origin/develop" ]
then
  echo "develop branch building..."
  npm run build:qa
elif [ $BRANCH == "origin/master" ]
then
  echo "master branch building..."
  npm run build:prod
  # @todo 这里将构建后的前端包发布到生产环境
  # 测试服务器地址 /root/jenkins_home/workspace/admin/dist/prod
  # scp -P 9999 -o StrictHostKeyChecking=no ./dist/${ASSETS} node@${SERVER_1}:/home/wwwroot/${PROJECT}/
else
  echo "develop branch building..."
  npm run build:qa
fi

