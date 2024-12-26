# AlemonJS GUI

开发文档[https://alemonjs.com/](https://alemonjs.com/)

这是一个可以在vscode中使用gui平台进行测试的插件。

新增alemon.config.yaml文件并配置。

- alemon.config.yaml

```yaml
gui:
  port: 9601
```

拉取开发模版后，一般需要这样去启动服务

```sh
yarn run dev --login gui
```

启动后，需要点击`连接`才可以进行后续操作
