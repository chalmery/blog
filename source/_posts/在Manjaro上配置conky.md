---
title: 在Manjaro上配置conky
categories:
  - 工具
tags:
  - Linux
toc: true
abbrlink: 503294022
date: 2022-03-06 00:00:00
updated: 2022-03-06 00:00:00
---
## 一 下载conky

使用pacman,或者yay，或者使用gnome的商店都可以下载：

```sh
sudo pacman -S conky
yay -S conky
```

在家目录新建一个.conkyrc的文件，写上配置文件即可，效果如下：

![截屏-20220306110328-2560x1600](https://img.yangcc.top/img/截屏-20220306110328-2560x1600.png)

## 二 设置开机自启

比如在gnome中工具中设置开机自启，是没有效果的，因为conky需要在系统启动桌面加载好后才启动，因此需要一个延时，因此，在目录 `~/.config/autostart/`目录中可以看到很多的开机自启的 `desktop`文件，因此只需要新建一个 `sh`设置休眠后启动即可：

1. 在家目录新建一个 `conky.sh`

```sh
#!/bin/bash
sleep 5 && conky
```

2. 在 `~/.config/autostart/`新建一个 `dekstop`文件

```desktop
[Desktop Entry]
Type=Application
Name=conky
Exec=/home/${你的用户名}/conky.sh
```

这样conky就能正常的启动了

## 三 相关文件：

配置文件：

```
alignment top_right
background no
border_width 0
cpu_avg_samples 16
default_color green
default_outline_color white
default_shade_color 000000
draw_borders no
draw_graph_borders yes
draw_outline no
draw_shades no
use_xft yes
font Noto Sans Regular:size=8
xftfont Noto Sans Regular:size=8
override_utf8_locale yes
minimum_size 280 5
maximum_width 350
net_avg_samples 2
no_buffers yes
out_to_console no
out_to_stderr no
extra_newline no
own_window yes
own_window_class Conky
own_window_type desktop
own_window_hints undecorated,below,sticky,skip_taskbar,skip_pager
double_buffer yes
own_window_colour 000000
own_window_argb_visual yes
own_window_argb_value 0
stippled_borders 0
update_interval 1.0
uppercase no
use_spacer none
show_graph_scale no
show_graph_range no
gap_x 10
gap_y 50
default_color ffffff
default_shade_color 000000
default_outline_color 000000

TEXT
${voffset 3}${color EAEAEA}${font Noto Sans Regular:pixelsize=100}${time %H:%M}${voffset -26}${color EAEAEA}${font Noto Sans Regular:pixelsize=40} ${color #7fef94}${time %B} ${font}${voffset -3}${offset 2}${color #fdc92d}${font Noto Sans Regular:pixelsize=30}${time %d号} ${font}${voffset 25}${font Noto Sans Regular:pixelsize=30}${offset -55}${time %A}
${color}${hr 1}
${font Noto Sans Regular:pixelsize=25}${color #fdc92d}主机名称：${alignr}${color } Linux $kernel
${color #fdc92d}主机名称：${alignr}${color } $nodename
${color #fdc92d}内核版本：${alignr}${color }$kernel
${color #fdc92d}运行时间：${alignr}${color }$uptime

####系统####
${color lightblue}${font :bold:size=12}${color lightblue}系统${alignr 180}${color}${hr 1}
${font Noto Sans Regular:pixelsize=25}${color #fdc92d}CPU:${alignr} $color${cpu}% ${color #78af78}${cpubar 10,60}
${color #fdc92d}内存: $color$mem / $memmax ${color}${alignr}$memperc% ${color #78af78}${membar 10,60}
${color #fdc92d}根分区: ${color}${fs_free /} / ${fs_size /}${alignr}${color #78af78}${fs_bar 10,60 /}
${color #fdc92d}用户分区: $color${fs_free /home} / ${fs_size /home} ${color #78af78}${alignr}${fs_bar 10,60 /home}

####网络####
${color lightblue}${font :bold:size=12}${color lightblue}网络${alignr 180}${color}${hr 1}
${font Noto Sans Regular:pixelsize=25}${color #fdc92d}无线WIFI：${alignr}${color}${font :pixelsize=25} IP：${addr wlp1s0}
${color #7fef94}${font Noto Sans Regular:pixelsize=25}下载： ${downspeed wlp1s0} KiB/s ${alignr}上传： ${upspeedf wlp1s0} KiB/s
${color #C9C9C9}${downspeedgraph wlp1s0 20,100} ${alignr}${upspeedgraph wlp1s0 20,100}
$color总计： ${totaldown wlp1s0} ${alignr}总计： ${totalup wlp1s0}

${font Noto Sans Regular:pixelsize=25}${color #fdc92d}本地连接：${alignr} ${color}${font :pixelsize=25} IP：${addr enp2s0}
${color #7fef94}${font Noto Sans Regular:pixelsize=25}下载： ${downspeedf enp2s0} KiB/s ${alignr} 上传： ${upspeedf enp2s0} KiB/s
${color #C9C9C9}${downspeedgraph enp2s0 20,100} ${alignr}${upspeedgraph enp2s0 20,100}
$color总计： ${totaldown enp2s0} ${alignr}总计： ${totalup enp2s0}

#随便写点啥＃
$alignc ${color #056107}${font :bold:size=5}
```
