
### Centos7 查看，打开，关闭防火墙的命令 及 查看开放端口及端口号的命令

#### 一）查看，打开，关闭防火墙的命令

#### 1）查看防火墙状态的命令：
```
sudo systemctl status firewalld
```
如果看到绿色的字体 active，就意味着防火墙是打开的状态。

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/9.png" /> <br />

如上，说明我们的防火墙是关闭的。

#### 2）打开防火墙的命令：
```
sudo systemctl start firewalld
```
我们再次使用上面的查看防火墙状态的命令查看下 是否打开了，如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/10.png" /> <br />

说明现在我们的防火墙已经是打开状态了。

#### 3）关闭防火墙的命令：
```
sudo systemctl stop firewalld
```
如下所示：

<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/11.png" /> <br />

如上关闭后，我们再次使用查看状态命令查看是否关闭成功，如果我们看到 disabled; vendor preset: enabled)， 就是关闭状态。

如果我们想彻底关闭防火墙则输入如下命令：  
```
sudo systemctl disable firewalld
```

#### 4）重启防火墙
```
sudo systemctl restart firewalld
```
#### 5）设置开机启动防火墙
```
sudo systemctl enable firewalld
```
#### 6）查看防火墙设置开机自动是否成功
```
sudo systemctl is-enabled firewalld;echo $?
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/14.png" /> <br />

#### 7) 禁止防火墙开机启动
```
sudo systemctl disable firewalld
```

```
// 查看防火墙的状态的命令为：
sudo systemctl status firewalld
 
// 打开防火墙的方式有两种，一种是打开后重启会恢复回原来的状态，命令为：
sudo systemctl start firewalld
// 关闭的
sudo systemctl stop firewalld
 
// 另一种是打开后重启不会恢复到原来的状态，命令为：这种方式输入命令后要重启系统才会生效。
sudo systemctl enable firewalld
// 关闭 
sudo systemctl disable firewalld
```

#### 二）查看开放端口及端口号的命令

#### 2.1）查看已开放的端口
```
firewall-cmd --list-ports
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/12.png" /> <br />

#### 2.2）查看端口是否被占用
```
netstat -tunpl | grep "端口"
```
比如我们查看80端口是否被占用，命令如下：
```
netstat -tunpl | grep 80
```
<img src="https://raw.githubusercontent.com/kongzhi0707/front-end-learn/master/linux/images/13.png" /> <br />

#### 2.3）开放单个端口（开放后需要要重启防火墙才生效）
```
firewall-cmd --zone=public --add-port=8080/tcp --permanent
// （--permanent  为永久生效，不加为单次有效（重启失效））
```
#### 2.4）开放多个端口（开放后需要要重启防火墙才生效）
```
firewall-cmd --zone=public --add-port=20000-29999/tcp --permanent
#（--permanent  为永久生效，不加为单次有效（重启失效））
```
#### 2.5）关闭端口（关闭后需要要重启防火墙才生效）
```
firewall-cmd --zone=public --remove-port=8080/tcp --permanent
```








