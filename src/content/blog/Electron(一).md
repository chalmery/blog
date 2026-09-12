---
title: Electron(一)
categories:
  - 技术
tags:
  - JavaScript
  - Electron
toc: true
abbrlink: 2402782093
date: 2023-06-22 00:00:00
updated: 2023-06-22 00:00:00
---
# Electron(一)

Electron是一个js桌面端框架，让html，js 打包为桌面应用成为可能，已经有非常多的应用使用了这门技术，如：vscode，notion，figma，思源笔记等等

![image](https://img-yangcc.oss-cn-beijing.aliyuncs.com/blog/Snipaste_2024-05-06_15-04-27.png)

## 一 整体交互形式

桌面应用最重要的是什么，或者说和浏览器页面有什么区别？大的来说就是可以和操作系统交互，那么什么叫可以和操作系统交互？让我们回顾下浏览器，浏览器就像一个盒子，里面的所有页面的权利是有限的，就比如，

* 我想在浏览器自己写的一个html页面通过js函数，在文档这个文件夹下创建一个文件，或者修改一个文件
* 调用系统通知api，使用系统通知
* 修改系统音量？

这些都是做不到的，这些都涉及了操作系统的api，那electron是如何做到的呢，我们看下这个图：

![image](https://img-yangcc.oss-cn-beijing.aliyuncs.com/blog/Snipaste_2024-05-06_15-04-35.png)

Electron就相当于一个中间层，为js提供了一个曲线访问系统api的能力，做任何和系统有关的操作，都要通过electron

一个简单的例子，我想通过，文件选择器，拿到一个文件的路径，该如何实现？你可能会想到，浏览器也可以呀，通过选择器，选择一个文件，还要Electron干嘛？

是没问题，可以选到一个文件，但是文件的路径是获取不到的，简单思考下，如果一个普通的网页，点击就能获取到你本机文件的路径，甚至别的操作系统信息，你做为浏览器的开发者会允许这样吗？这样对浏览器使用者来讲显然是非常危险的，点开个网页信息泄密了，甚至电脑上文件丢了。

因此，我们要使用的文件选择器是操作系统的文件选择器，这个显然是js办不到的，因此有了Electron，它提供了这样的api：文档详见：[https://www.electronjs.org/zh/docs/latest/api/dialog](https://www.electronjs.org/zh/docs/latest/api/dialog)

```js
import {dialog} from "electron";

function open() {
    let files = dialog.showOpenDialogSync({
        title: '选择文件路径',
        properties: ['openDirectory', 'multiSelections']
    })
    console.log(files)
    return files
}
```

文件选择器是有了，我们该如何通知Electron呢？换句话说就是，上面的js函数是显示层调用不到的，因此Electron提供了一种方式，让我们可以与它交互。这种方式类似js的发布订阅模型，发布一个事件，消费者监听事件。

文档详见：[https://www.electronjs.org/zh/docs/latest/api/ipc-renderer](https://www.electronjs.org/zh/docs/latest/api/ipc-renderer)

js端通过ipcRenderer.send发送一个事件通过Electron

```js
const electron = window.electron

electron.ipcRenderer.send('事件名称',data)
```

electron端通过ipcMain.on监听js端发送过来的事件，那当这件事情处理完成了，想要告诉js端怎么办？通过event.reply发送一个事件，携带数据给js，和上面的ipcRenderer.send是类似的

```js
import {ipcMain} from "electron"

 ipcMain.on('事件名称',(event, data)) => {
        //处理


        //回调
        event.reply('新的事件名称', 要返回的数据)
    })
```

js端该如何处理呢？以React为例：useEffect中，通过ipcRenderer.on，监听这个事件，然后处理，一定要在[]这个useEffect，代表页面创建就运行这个函数，监听这个事件，在return中删除这个事件，不然每次每次页面加载都会创建一个监听，这样会越建越多

```js
useEffect(() => {
    //处理Electron端发送的事件
    electron.ipcRenderer.on('事件名称', (event, 数据) => {
      //处理
    });

    return () => {
      electron.ipcRenderer.removeAllListeners('事件名称');
    };
  }, []);
```

到这里就完成了一个交互，是不是很简单。

## 二 打包

打包全靠配置，这个是我的配置：

```json
/**
 * @see https://www.electron.build/configuration/configuration
 */
{
  appId: "electron-music",
  productName: "electron-music",
  copyright: "Copyright © 2023 ${author}",
  asar: true,
  directories: {
    output: "release",
    buildResources: "public"
  },
  files: [
    "dist"
  ],
  win: {
    icon: "public/icons/music256x256.png",
    target: [
      {
        target: "dir",
        arch: [
          "x64"
        ]
      },
      {
        target: "nsis",
        arch: [
          "x64"
        ]
      }
    ]
  },
  nsis: {
    "oneClick": false,
    // 创建一键安装程序还是辅助安装程序（默认是一键安装）
    "allowElevation": true,
    // 是否允许请求提升，如果为false，则用户必须使用提升的权限重新启动安装程序 （仅作用于辅助安装程序）
    "allowToChangeInstallationDirectory": true,
    // 是否允许修改安装目录 （仅作用于辅助安装程序）
    "installerIcon": "public/icons/music256x256.png",
    // 安装程序图标的路径
    "uninstallerIcon": "public/icons/music256x256.png",
    // 卸载程序图标的路径
    "installerHeader": "public/icons/music256x256.png",
    // 安装时头部图片路径（仅作用于辅助安装程序）
    "installerHeaderIcon": "public/icons/music256x256.png",
    // 安装时标题图标（进度条上方）的路径（仅作用于一键安装程序）
    "installerSidebar": "public/icons/music256x256.png",
    // 安装完毕界面图片的路径，（仅作用于辅助安装程序）
    "uninstallerSidebar": "public/icons/music256x256.png",
    // 开始卸载界面图片的路径（仅作用于辅助安装程序）
    "uninstallDisplayName": "electron-music-${version}",
    // 控制面板中的卸载程序显示名称
    "createDesktopShortcut": true,
    // 是否创建桌面快捷方式
    "createStartMenuShortcut": true,
    // 是否创建开始菜单快捷方式
    "include": "script/installer.nsi",
    // NSIS包含定制安装程序脚本的路径，安装过程中自行调用  (可用于写入注册表 开机自启动等操作)
    "script": "script/installer.nsi",
    // 用于自定义安装程序的NSIS脚本的路径
    "deleteAppDataOnUninstall": true,
    // 是否在卸载时删除应用程序数据（仅作用于一键安装程序）
    "runAfterFinish": false,
    // 完成后是否运行已安装的应用程序（对于辅助安装程序，应删除相应的复选框）
    "menuCategory": false,
    // 是否为开始菜单快捷方式和程序文件目录创建子菜单，如果为true，则使用公司名称
    "perMachine": true,
    //给机器上所有用户安装
    "language": "2052"
    //安装语言(中文)
  },
  mac: {
    icon: 'public/icons/music256x256.png',
    category: 'Productivity',
    target: [
      {
        target: 'default',
        arch: [
          'arm64',
          'x64'
        ]
      }
    ]
  },
  linux: {
    icon: "public/icons/music256x256.png",
    target: [
      "AppImage",
      "tar.gz"
    ],
    "category": "Audio",
    artifactName: "${productName}-Linux-${version}.${ext}"
  }
}

```

参考:  [我的音乐播放器项目](https://github.com/chalmery/electron-music "我的音乐播放器项目")

## 三 注意事项

### 1 在linux下窗口关闭前做一件事

看环境，比如kde下是做不到比如隐藏窗口的，在kde下，点击关闭按钮，window对象对直接就销毁了。（曲线方式，我们可以不用系统自带的顶栏，自己实现一个，这样就不会有这样的问题了）

```js
app.on('closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

### 2 linux 下，英伟达显卡涉及到动画的页面报错（暂未解决）

报错内容

```js
libva error: vaGetDriverNameByIndex() failed with unknown libva error, driver_name = (null)
```

‍
