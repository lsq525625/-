1.9.1 / 2018-11-06
==================

* [修复自闭合的 wxs 标签会导致高亮问题的 BUG](https://github.com/wx-minapp/minapp-vscode/issues/4)

1.9.0 / 2018-10-07
==================

* 同步官方组件的最新数据

1.8.0 / 2018-09-02
==================

* 同步官方组件的最新数据

1.7.2 / 2018-08-06
==================

* 添加配置项 `reserveTags`，一般 "text" 标签中的内容如果过长，格式化后会在行首和行尾添加换行符，如果不需要，可以将 reserveTags 设置成 `["text"]`

1.7.1 / 2018-07-29
==================

* 添加配置项 `wxmlQuoteStyle` 和 `pugQuoteStyle`，可以配置自动生成的引号是 `"` 还是 `'`，并且 snippet 中的引号也会使用配置的引号

1.7.0 / 2018-07-07
==================

* 优化自动补全体验，不再需要输入空格触发自动补全，自动会在合适的时机触发
* 修复 wxs 标签在格式化时前后添加换行符的问题 [#84](https://github.com/qiu8310/minapp/issues/84)
* 修复 wxml `{{'a' + foo + 'b'}}` 中的表达式不高亮的问题

1.6.1 / 2018-06-28
==================

* 更新项目 @minapp/wxml-parser，旧版处理多余的结束标签会报错

1.6.0 / 2018-06-23
==================

* wxml 中支持 [emmet 语法](https://docs.emmet.io/cheat-sheet/)，[详情见下文](#emmet)
* 自动关联文件类型
  - *.wxs => javascript
  - *.cjson => jsonc
  - *.wxss => css
* wxml 文件在格式化时，标签属性值上的引号会保留原有的风格（即如果原来是双引号，格式化后也会是双引号；原来是单引号，格式化后也会是单引号）


1.5.1 / 2018-06-15
==================

* 同步微信官方发布的 [2.1.0](https://developers.weixin.qq.com/miniprogram/dev/devtools/uplog.html#20180614-%E5%9F%BA%E7%A1%80%E5%BA%93%E6%9B%B4%E6%96%B0%EF%BC%88210%EF%BC%89) 的组件数据


1.5.0 / 2018-06-10
==================

* 纯 wxml 文件中支持 [wxs 标签](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxs/01wxs-module.html)

1.4.0 / 2018-06-05
==================

* 在自动补全中支持生成 self close tag

  可以在配置项 `minapp-vscode.selfCloseTags` 中配置这些 self close tag

* 格式化选项 `minapp-vscode.formatMaxLineCharacters` 支持设置成 0 来表示无限大

  如果为 0 时，在格式化时所有的直接含有文本的标签都会格式在一行中


1.3.1 / 2018-06-03
==================

* wxml 语言中高亮匹配的标签 [#72](https://github.com/qiu8310/minapp/issues/72)

1.3.0 / 2018-05-26
==================

* 添加 snippets 功能 [详情查看](https://github.com/wx-minapp/minapp-vscode/blob/master/./README.md#snippets)

* 优化变量高亮（切换文件时，会有些延迟），见 [#68](https://github.com/qiu8310/minapp/issues/68)
* 标签的属性值是布尔值时，会自动弹出 true/false 来让你选择
* 修复自动补全中默认值无法在编辑时选中的问题


1.2.0 / 2018-05-07
==================

* 模板文件中 js 变量高亮（纯 wxml 文件才支持，vue 文件不支持），[详情查看](https://github.com/wx-minapp/minapp-vscode/blob/master/./README.md#highlight)

1.1.1 / 2018-05-03
==================

* 更新小程序组件数据，主要添加了 [ad 组件](https://developers.weixin.qq.com/miniprogram/dev/component/ad.html)

1.1.0 / 2018-04-28
==================

* wxml / pug 文件中的 src 标签支持 link 功能（另外可以通过配置 `minapp-vscode.linkAttributeNames` 来支持更多的标签）
* 添加新配置 `minapp-vscode.formatMaxLineCharacters` 可以指定格式化时每行最长的字符数`, close [61](https://github.com/qiu8310/minapp/issues/61)
* 更新官方组件数据

1.0.14 / 2018-04-09
==================

* 修复 pug 语言中，在单行的标签中，写 text 的时候也会触发属性补全

1.0.12 / 2018-04-05
==================

* 支持 pug 语言

  现在需要在 vue 的 template 上指定 `lang` 和 `minapp` 两个选项，如果不指定 `minapp`，默认为 `minapp="mpvue"`

  如:

  1. `<template lang="wxml" minapp="native">`   表示使用 wxml 语言，不使用任何框架
  2. `<template lang="pug" minapp="mpvue">`     表示使用 pug 语言，并使用 mpvue 框架

1.0.10 / 2018-03-31
==================

* 支持 wxml/wepy/mpvue 三类语言的补全
* 补全信息可配置

1.0.6 / 2018-03-23
==================

* 支持格式化 wxml 格式的文件（使用系统的格式化命令即可）
* 插件的分类改成了 `languages`

1.0.4 / 2018-03-17
==================

* 在 vue 模板文件中也能自动补全
