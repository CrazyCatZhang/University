<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne"><image src="../../static/images/common/back.png" mode="" class="back-img"></image></view>
			<view class="top-bar-center">
				<view class="title">{{ fname }}</view>
			</view>
			<view class="top-bar-right">
				<view class="pice"></view>
				<view class="group-img" v-if="type == 1"><image :src="fimgurl" mode=""></image></view>
			</view>
		</view>
		<scroll-view class="chat" scroll-y="true" :scroll-with-animation="swanititon" :scroll-into-view="scrollToView" @scrolltoupper="nextPage">
			<view class="chat-main" :style="{ paddingBottom: inputh + 'px' }">
				<view class="loading" :class="{ displaynone: isloading }">
					<image src="../../static/images/common/loading.png" mode="" class="loading-img" :animation="animationData"></image>
				</view>
				<view class="chat-ls" v-for="(item, index) in msgs" :key="index" :id="'msg' + item.id">
					<view class="chat-time" v-if="item.time != ''">{{ changeTime(item.time) }}</view>
					<view class="msg-m msg-left" v-if="item.fromId != uid">
						<image :src="item.imgurl" mode="" class="user-img"></image>
						<view class="message" v-if="item.types == 0">
							<view class="msg-text">{{ item.message }}</view>
						</view>
						<view class="message" v-if="item.types == 1"><image :src="item.message" mode="widthFix" class="msg-img" @tap="previewImg(item.message)"></image></view>
						<view class="message" v-if="item.types == 2">
							<view class="msg-text voice" :style="{ width: item.message.time * 4 + 'px' }" @tap="playVoice(item.message.voice)">
								<image src="../../static/images/chatroom/yy.png" mode="" class="voice-img"></image>
								{{ item.message.time }}″
							</view>
						</view>
						<view class="message" v-if="item.types == 3">
							<view class="msg-map" @tap="openLocation(item.message)">
								<view class="map-name">{{ item.message.name }}</view>
								<view class="map-address">{{ item.message.address }}</view>
								<image src="../../static/images/chatroom/map.png" mode="aspectFit" class="map-img"></image>
								<!-- <map name="" class="map" :longitude="item.message.longitude" :latitude="item.message.latitude" :markers="covers(item.message)"></map> -->
							</view>
						</view>
					</view>
					<view class="msg-m msg-right" v-if="item.fromId == uid">
						<image :src="item.imgurl" mode="" class="user-img"></image>
						<view class="message" v-if="item.types == 0">
							<view class="msg-text">{{ item.message }}</view>
						</view>
						<view class="message" v-if="item.types == 1"><image :src="item.message" mode="widthFix" class="msg-img" @tap="previewImg(item.message)"></image></view>
						<view class="message" v-if="item.types == 2">
							<view class="msg-text voice" :style="{ width: item.message.time * 4 + 'px' }" @tap="playVoice(item.message.voice)">
								{{ item.message.time }}″
								<image src="../../static/images/chatroom/yy.png" mode="" class="voice-img"></image>
							</view>
						</view>
						<view class="message" v-if="item.types == 3">
							<view class="msg-map" @tap="openLocation(item.message)">
								<view class="map-name">{{ item.message.name }}</view>
								<view class="map-address">{{ item.message.address }}</view>
								<image src="../../static/images/chatroom/map.png" mode="aspectFit" class="map-img"></image>
								<!-- <map name="" class="map" :longitude="item.message.longitude" :latitude="item.message.latitude" :markers="covers(item.message)"></map> -->
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="padbt"></view>
		</scroll-view>
		<submit @inputs="inputs" @heights="heights"></submit>
	</view>
</template>

<script>
import datas from '../../commons/js/datas.js';
import myfun from '../../commons/js/method.js';
import submit from '../../components/submit/submit.vue';

//播放语音
const innerAudioContext = uni.createInnerAudioContext();

export default {
	data() {
		return {
			uid: '',
			uimgurl: '',
			token: '',
			uname: '',
			fid: '',
			fname: '',
			fimgurl: '',
			type: '',
			msgs: [],
			imgMsg: [],
			scrollToView: '',
			oldTime: 0,
			inputh: '72',
			animationData: {},
			nowpage: 0,
			pagesize: 10,
			loading: '',
			isloading: true,
			swanititon: true,
			beginloading: true
		};
	},
	onLoad: function(e) {
		this.fid = e.id;
		this.fname = e.name;
		this.type = e.type;
		this.fimgurl = e.img;
		this.getStorage();
		this.getMsg();
		this.receiveSocketMsg();
	},
	components: {
		submit
	},
	methods: {
		//获取登录成功的本地缓存数据
		getStorage: function() {
			try {
				const value = uni.getStorageSync('user');
				if (value) {
					this.uid = value.id;
					this.uimgurl = this.serverUrl + value.imgurl;
					this.token = value.token;
					this.uname = value.name;
				} else {
					//如果没有数据缓存就跳转到登录界面去
					uni.navigateTo({
						url: '../login/login'
					});
				}
			} catch (e) {
				// error
			}
		},
		backOne: function() {
			uni.navigateBack({
				delta: 1
			});
		},
		//处理时间
		changeTime: function(date) {
			return myfun.dateTime1(date);
		},
		//获取聊天数据
		getMsg: function() {
			console.log(this.uid);
			console.log(this.fid);
			uni.request({
				url: this.serverUrl + '/chat/chatmsg',
				data: {
					uid: this.uid,
					fid: this.fid,
					nowPage: this.nowpage,
					pageSize: this.pagesize,
					token: this.token
				},
				method: 'POST',
				success: data => {
					let status = data.data.status;
					// console.log(status);
					if (status == 200) {
						let msg = data.data.result;
						// console.log(res);
						//将数组倒序
						msg.reverse();
						if (msg.length > 0) {
							let oldtime = msg[0].time;
							let imgarr = [];
							msg[0].imgurl = this.serverUrl + msg[0].imgurl;
							for (var i = 1; i < msg.length; i++) {
								msg[i].imgurl = this.serverUrl + msg[i].imgurl;
								//时间间隔
								if (i < msg.length - 1) {
									let t = myfun.spacTime(oldtime, msg[i].time);
									if (t) {
										oldtime = t;
									}
									msg[i].time = t;
								}
								//匹配最大时间
								if (this.nowpage == 0) {
									if (msg[i].time > this.oldTime) {
										this.oldTime = msg[i].time;
									}
								}
								//补充图片地址
								if (msg[i].types == 1) {
									msg[i].message = this.serverUrl + msg[i].message;
									imgarr.push(msg[i].message);
								}
							}
							this.msgs = msg.concat(this.msgs);
							this.imgMsg = imgarr.concat(this.imgMsg);
						}
						//判断nowpage
						if (msg.length == 10) {
							this.nowpage++;
						} else {
							//数据获取完毕
							this.nowpage = -1;
						}
						//页数加1
						this.$nextTick(function() {
							//取消动画
							this.swanititon = false;
							this.scrollToView = 'msg' + this.msgs[msg.length - 1].id;
						});
						clearInterval(this.loading);
						//关闭loading
						this.isloading = true;
						//开启加载
						this.beginloading = true;
					} else if (status == 500) {
						uni.showToast({
							title: '服务器出错啦！',
							icon: 'none',
							duration: 2000
						});
					} else if (status == 300) {
						//token过期跳回登录页面
						uni.navigateTo({
							url: '../login/login?name=' + this.myname
						});
					}
				}
			});
		},
		//获取聊天数据
		getMsg1: function(page) {
			let msg = datas.message();
			let maxpages = msg.length;
			if (msg.length > (page + 1) * 10) {
				maxpages = (page + 1) * 10;
				this.nowpage++;
			} else {
				//数据获取完毕
				this.nowpage = -1;
			}
			for (var i = page * 10; i < maxpages; i++) {
				msg[i].imgurl = '../../static/images/img/' + msg[i].imgurl;
				//时间间隔
				if (i < msg.length - 1) {
					let t = myfun.spacTime(this.oldTime, msg[i].time);
					if (t) {
						this.oldTime = t;
					}
					msg[i].time = t;
				}
				//补充图片地址
				if (msg[i].types == 1) {
					msg[i].message = '../../static/images/img/' + msg[i].message;
					this.imgMsg.unshift(msg[i].message);
				}
				this.msgs.unshift(msg[i]);
			}
			this.$nextTick(function() {
				//取消动画
				this.swanititon = false;

				this.scrollToView = 'msg' + this.msgs[maxpages - page * 10 - 1].tip;
			});
			clearInterval(this.loading);
			//关闭loading
			this.isloading = true;
			//开启加载
			this.beginloading = true;
		},
		//预览图片
		previewImg: function(e) {
			let index = 0;
			for (var i = 0; i < this.imgMsg.length; i++) {
				if (this.imgMsg[i] == e) {
					index = i;
				}
			}

			uni.previewImage({
				current: index,
				urls: this.imgMsg,
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function(data) {
						console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					},
					fail: function(err) {
						console.log(err.errMsg);
					}
				}
			});
		},
		//接收输入内容
		inputs: function(e) {
			this.receiveMsg(e, this.uid, this.uimgurl, 0);
		},
		//接收消息
		receiveMsg: function(e, id, img, tip) {
			//tip==0表示自己发的 tip=1
			this.swanititon = true;
			let len = this.msgs.length;
			//时间间隔
			let nowTime = new Date();
			let t = myfun.spacTime(this.oldTime, nowTime);
			if (t) {
				this.oldTime = t;
			}
			nowTime = t;
			let data = {
				fromId: id, //发送者id
				imgurl: img,
				message: e.message,
				types: e.types, //内容类型（0文字，1图片链接，2音频连接...)
				time: nowTime, //发送时间
				id: len
			};
			this.msgs.push(data);
			this.goBottom();

			//socket提交
			//文字
			if (e.types == 0 || e.types == 3) {
				this.sendSocket(e);
			}
			//图片
			if (e.types == 1) {
				this.imgMsg.push(e.message);
				//提交图片
				//当前日期文件夹添加
				let url = myfun.fileName(new Date());
				const uploadTask = uni.uploadFile({
					url: this.serverUrl + '/files/upload', //仅为示例，非真实的接口地址
					filePath: e.message,
					name: 'file',
					formData: {
						url: url,
						name: new Date().getTime() + this.uid + Math.ceil(Math.random() * 10)
					},
					success: uploadFileRes => {
						console.log(uploadFileRes);
						let data = {
							message: uploadFileRes,
							types: e.types
						};
						this.sendSocket(data);
						// let path = this.serverUrl + uploadFileRes.data;
						// this.img.push(path);
						// console.log(this.img.length);
					}
				});

				uploadTask.onProgressUpdate(res => {
					// console.log('上传进度' + res.progress);
					// console.log('已经上传的数据长度' + res.totalBytesSent);
					// console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
					// // 测试条件，取消上传任务。
					// if (res.progress > 50) {
					// 	uploadTask.abort();
					// }
				});
			}
			//音频
			if (e.types == 2) {
				//提交音频
				//当前日期文件夹添加
				let url = myfun.fileName(new Date());
				const uploadTask = uni.uploadFile({
					url: this.serverUrl + '/files/upload', //仅为示例，非真实的接口地址
					filePath: e.message.voice,
					name: 'file',
					formData: {
						url: url,
						name: new Date().getTime() + this.uid + Math.ceil(Math.random() * 10)
					},
					success: uploadFileRes => {
						console.log(uploadFileRes);
						let data = {
							message: uploadFileRes,
							types: e.types
						};
						this.sendSocket(data);
						// let path = this.serverUrl + uploadFileRes.data;
						// this.img.push(path);
						// console.log(this.img.length);
					}
				});

				// uploadTask.onProgressUpdate(res => {
				// console.log('上传进度' + res.progress);
				// console.log('已经上传的数据长度' + res.totalBytesSent);
				// console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);

				// // 测试条件，取消上传任务。
				// if (res.progress > 50) {
				// 	uploadTask.abort();
				// }
				// });
			}
		},
		//聊天数据发送给后端
		sendSocket: function(e) {
			if (this.type == 0) {
				//好友聊天
				this.socket.emit('msg', e, this.uid, this.fid);
			} else {
				//群聊
				this.socket.emit('groupMsg', e, this.uid, this.fid);
			}
		},
		//socket聊天数据接收
		receiveSocketMsg: function() {
			this.socket.on('msg', (msg,fromid) => {
				console.log(msg + ':' + fromid);
			});
		},
		//输入框高度
		heights: function(e) {
			this.inputh = e;
			this.goBottom();
		},
		//滚动到底部
		goBottom: function() {
			this.swanititon = true;
			this.scrollToView = '';
			this.$nextTick(function() {
				let len = this.msgs.length - 1;
				this.scrollToView = 'msg' + this.msgs[len].tip;
			});
		},
		//播放音频
		playVoice: function(e) {
			innerAudioContext.src = e;
			innerAudioContext.play();
		},
		//地图定位
		covers: function(e) {
			let map = [
				{
					latitude: e.latitude,
					longitude: e.longitude,
					iconPath: '../../static/images/chatroom/dw.png'
				}
			];
			return map;
		},
		//导航
		openLocation: function(e) {
			uni.openLocation({
				latitude: e.latitude,
				longitude: e.longitude,
				name: e.name,
				address: e.address,
				success: function() {
					console.log('success');
				}
			});
		},
		//滚动顶部加载下一页
		nextPage: function() {
			if (this.nowpage > 0 && this.beginloading) {
				//出现loading
				this.isloading = false;
				//禁止重复加载
				this.beginloading = false;

				var animation = uni.createAnimation({
					duration: 1000,
					timingFunction: 'step-start'
				});

				this.animation = animation;

				let i = 1;
				this.loading = setInterval(
					function() {
						animation.rotate(i * 30).step();
						this.animationData = animation.export();
						i++;
						if (i > 20) {
							this.getMsg(this.nowpage);
						}
					}.bind(this),
					100
				);
			}
		}
	}
};
</script>

<style lang="scss">
@import '../../commons/css/common.scss';

page {
	height: 100%;
}

.content {
	height: 100%;
	background-color: rgba(244, 244, 244, 1);
}

.top-bar {
	background-color: rgba(244, 244, 244, 0.96);
	border-bottom: 1px solid $uni-border-color;

	.group-img {
		position: absolute;
		bottom: 10rpx;
		right: $uni-spacing-col-base;
		width: 68rpx;
		height: 68rpx;

		image {
			width: 68rpx;
			height: 68rpx;
			border-radius: 16rpx;
		}
	}
}

.displaynone {
	display: none;
}

.chat {
	height: 100%;

	.padbt {
		width: 100%;
		height: env(safe-area-inset-bottom);
	}

	.loading {
		text-align: center;
		.loading-img {
			width: 60rpx;
			height: 60rpx;
		}
	}

	.chat-main {
		padding-left: $uni-spacing-col-base;
		padding-right: $uni-spacing-col-base;
		padding-top: 100rpx;
		// padding-bottom: 120rpx;
		display: flex;
		flex-direction: column;
	}

	.chat-ls {
		.chat-time {
			font-size: $uni-font-size-sm;
			color: rgba(39, 40, 50, 0.3);
			line-height: 34rpx;
			padding: 20rpx 0;
			text-align: center;
		}

		.msg-m {
			display: flex;
			padding: 20rpx 0;

			.user-img {
				flex: none;
				width: $uni-img-size-sm;
				height: $uni-img-size-sm;
				border-radius: $uni-border-radius-base;
			}

			.message {
				flex: none;
				max-width: 480rpx;
			}

			.msg-text {
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
				padding: 18rpx 24rpx;
			}

			.msg-img {
				max-width: 400rpx;
				border-radius: $uni-border-radius-base;
			}

			.voice {
				min-width: 80rpx;
				max-width: 400rpx;
			}

			.voice-img {
				width: 28rpx;
				height: 36rpx;
			}

			.msg-map {
				background-color: #ffffff;
				width: 464rpx;
				height: 284rpx;
				overflow: hidden;

				.map-name {
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 44rpx;
					padding: 18rpx 24rpx 0 24rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}

				.map-address {
					font-size: $uni-font-size-sm;
					color: $uni-text-color-disable;
					padding: 0 24rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}

				.map-img {
					padding-top: 8rpx;
					width: 480rpx;
					height: 180rpx;
				}
			}
		}

		.msg-left {
			flex-direction: row;

			.msg-text {
				margin-left: 16rpx;
				background-color: #ffffff;
				border-radius: 0 20rpx 20rpx 20rpx;
			}

			.msg-img {
				margin-left: 16rpx;
			}

			.voice {
				text-align: right;
			}

			.voice-img {
				float: left;
				transform: rotate(180deg);
				padding-bottom: 4rpx;
			}

			.msg-map {
				margin-left: 16rpx;
				border-radius: 0 20rpx 20rpx 20rpx;
			}
		}

		.msg-right {
			flex-direction: row-reverse;

			.msg-text {
				margin-right: 16rpx;
				background-color: #fff260;
				border-radius: 20rpx 0 20rpx 20rpx;
			}

			.msg-img {
				margin-right: 16rpx;
			}

			.voice {
				text-align: left;
			}

			.voice-img {
				float: right;
				padding-top: 4rpx;
			}

			.msg-map {
				margin-right: 16rpx;
				border-radius: 20rpx 0 20rpx 20rpx;
			}
		}
	}
}
</style>
