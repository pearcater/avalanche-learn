
 # avalanche-learn

Avalanche Pathway

环境要求

```
node v12.21.0
npm 
6.14.11
```

第一步：

```
  git clone https://github.com/pearcater/avalanche-learn.git
```

第二步：

```
cd avalanche-learn
```

```
npm install
```

第三步：

```
#修改 env文件中的密钥，就是你datahub的密钥
vi .env
```

第四步：

```
依次执行以下命令：
node connect.js
node create_account.js

#控制台将生成账号，此时需要前往水龙头领取测试币
#水龙头地址：https://faucet.avax-test.network/

node create_account.js
#此时将会查询到账号下的余额信息

node query.js

node transfer.js

node interchain_transfer.js
```

到这里任务已经全部完成，最好操作一次命令等5分钟，不然可能会被检测到。
