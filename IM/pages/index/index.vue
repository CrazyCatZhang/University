<template>
	<view class="content">
		<view class="top-bar">
			<navigator :url="'../userhome/userhome?id=' + uid" hover-class="none" class="top-bar-left"><image :src="imgurl" mode=""></image></navigator>
			<view class="top-bar-center"><image class="logo" src="../../static/images/index/logo.png" mode=""></image></view>
			<view class="top-bar-right">
				<view class="search" @tap="toSearch"><image src="../../static/images/index/search.png" mode=""></image></view>
				<view class="add"><image src="../../static/images/index/add.png" mode=""></image></view>
			</view>
		</view>
		<view class="main">
			<view class="refresh" v-if="!refresh">
				<image src="../../static/images/index/refresh.png" mode=""></image>
				<view class="ref-title">下拉刷新</view>
			</view>
			<view class="noone" v-if="noone">
				<image src="../../static/images/index/noone.png" mode="aspectFill"></image>
				<view class="no-title">你还没有好友~</view>
				<view class="search-bt" @tap="toSearch">搜索好友</view>
			</view>
			<view class="friends" v-if="requestData > 0" @tap="goRequest">
				<view class="friends-list">
					<view class="friends-list-l">
						<text class="tip">{{ requestData }}</text>
						<image src="../../static/images/index/apply.png" mode=""></image>
					</view>
					<view class="friends-list-r">
						<view class="top">
							<view class="name">好友申请</view>
							<view class="time">{{ changeTime(requestTime) }}</view>
						</view>
						<view class="news">茫茫人海，相聚便是缘分</view>
					</view>
				</view>
			</view>
			<view class="friends">
				<view class="friends-list" v-for="(item, index) in friends" :key="index" @tap="toChatRoom(item)">
					<view class="friends-list-l">
						<text class="tip" v-if="item.tip > 0">{{ item.tip }}</text>
						<image :src="item.imgurl" mode=""></image>
					</view>
					<view class="friends-list-r">
						<view class="top">
							<view class="name">{{ item.name }}</view>
							<view class="time">{{ changeTime(item.lastTime) }}</view>
						</view>
						<view class="news">{{ item.msg }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import datas from '../../commons/js/datas.js';
import method from '../../commons/js/method.js';
export default {
	data() {
		return {
			friends: [],
			uid: '', //用户id
			imgurl: '', //用户头像
			token: '', //token
			myname: '',
			requestData: 0, //申请数
			requestTime: 0, //申请时间
			refresh: false, //下拉刷新状态
			noone: false //是否没有好友
		};
	},
	onLoad() {
		this.getStorage();
		this.friendRquest();
		this.getFriends();
		this.join(this.uid);
		this.sockettest();
	},
	onPullDownRefresh() {
		this.friends = [];
		this.getStorage();
		this.friendRquest();
		this.getFriends();
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	methods: {
		changeTime: function(date) {
			return method.dateTime(date);
		},
		//获取登录成功的本地缓存数据
		getStorage: function() {
			try {
				const value = uni.getStorageSync('user');
				if (value) {
					this.uid = value.id;
					this.imgurl = this.serverUrl + value.imgurl;
					this.token = value.token;
					this.myname = value.name;
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
		//好友申请
		friendRquest: function() {
			uni.request({
				url: this.serverUrl + '/index/getfriend',
				data: {
					uid: this.uid,
					state: 1,
					token: this.token
				},
				method: 'POST',
				success: data => {
					this.refresh = true;
					// console.log(data);
					let status = data.data.status;
					if (status == 200) {
						this.noone = false;
						let res = data.data.result;
						this.requestData = res.length;
						if (res.length > 0) {
							this.requestTime = res[0].lastTime;
							for (var i = 0; i < res.length; i++) {
								if (this.requestTime < res[i].lastTime) {
									this.requestTime = res[i].lastTime;
								}
							}
						} else {
							this.noone = true;
						}
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
		//好友获取
		getFriends: function() {
			uni.request({
				url: this.serverUrl + '/index/getfriend',
				data: {
					uid: this.uid,
					state: 0,
					token: this.token
				},
				method: 'POST',
				success: data => {
					this.refresh = true;
					let status = data.data.status;
					if (status == 200) {
						let res = data.data.result;
						this.noone = false;
						if (res.length > 0) {
							for (var i = 0; i < res.length; i++) {
								res[i].imgurl = this.serverUrl + res[i].imgurl;
								if (res[i].markname) {
									res[i].name = res[i].markname;
								}
								this.friends.push(res[i]);
							}
							this.friends = method.paixu(this.friends, 'lastTime', 0);
							//获取好友内消息
							for (var i = 0; i < this.friends.length; i++) {
								this.getLastMsg(this.friends, i);
								this.getUnread(this.friends, i);
							}
						} else {
							this.noone = true;
						}
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
		//群
		getGroup: function() {
			uni.request({
				url: this.serverUrl + '/index/getgroup',
				data: {
					uid: this.uid,
					token: this.token
				},
				method: 'POST',
				success: data => {
					// console.log(data);
					let status = data.data.status;
					if (status == 200) {
						let res = data.data.result;
						if (res.length > 0) {
							this.requestTime = res[0].lastTime;
							for (var i = 0; i < res.length; i++) {
								if (this.requestTime < res[i].lastTime) {
									this.requestTime = res[i].lastTime;
								}
							}
						}
						console.log(res);
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
		//获取最后消息
		getLastMsg: function(arr, i) {
			uni.request({
				url: this.serverUrl + '/index/getlastmsg',
				data: {
					uid: this.uid,
					fid: arr[i].id,
					token: this.token
				},
				method: 'POST',
				success: data => {
					// console.log(data);
					let status = data.data.status;
					if (status == 200) {
						let res = data.data.result;
						if (res.types == 0) {
							//文字
						} else if (res.types == 1) {
							res.message = '[图片]';
						} else if (res.types == 2) {
							res.message = '[音频]';
						} else if (res.types == 3) {
							res.message = '[位置]';
						}
						let e = arr[i];
						e.msg = res.message;
						arr.splice(i, 1, e);
						console.log(res);
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
		//未读消息数
		getUnread: function(arr, i) {
			uni.request({
				url: this.serverUrl + '/index/unreadmsg',
				data: {
					uid: this.uid,
					fid: arr[i].id,
					token: this.token
				},
				method: 'POST',
				success: data => {
					// console.log(data);
					let status = data.data.status;
					if (status == 200) {
						let res = data.data.result;
						let e = arr[i];
						e.tip = res;
						arr.splice(i, 1, e);
						console.log(res);
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
		//socket模块
		//进行socket注册
		join: function(uid) {
			this.socket.emit('login',uid);
		},
		//服务器消息接收测试
		sockettest: function() {
			this.socket.on('login',id => {
				console.log('后端发送的消息：' + id);
			})
		},
		
		//跳转到搜索界面
		toSearch: function() {
			uni.navigateTo({
				url: '../search/search'
			});
		},
		//进入申请详情页面
		goRequest: function() {
			uni.navigateTo({
				url: '../friendrequest/friendrequest'
			});
		},
		//进入聊天界面
		toChatRoom: function(data) {
			uni.navigateTo({
				url: '../chatroom/chatroom?id=' + data.id + '&name=' + data.name + '&img=' + data.imgurl + '&type=' + data.type
			});
		}
	}
};
</script>

<style lang="scss">
@import '../../commons/css/common.scss';

.top-bar {
	background: rgba(255, 255, 255, 0.96);
	border-bottom: 1px solid $uni-border-color;

	.top-bar-right {
		image {
			padding: 18rpx 0 0 18rpx;
			width: 52rpx;
			height: 52rpx;
		}
	}
}

.main {
	// width: calc(100% - 32rpx);
	padding-top: 104rpx;
	padding-bottom: $uni-spacing-col-base;
	// border: 1px solid red;
}

.refresh {
	text-align: center;
	padding-top: 480rpx;

	image {
		width: 32rpx;
		height: 32rpx;
	}

	.ref-title {
		padding-top: 10rpx;
		font-size: $uni-font-size-base;
		color: rgba(39, 40, 50, 0.4);
		line-height: 40rpx;
	}
}

.noone {
	text-align: center;
	padding-top: 400rpx;

	image {
		width: 158rpx;
		height: 250rpx;
	}

	.no-title {
		padding: 32rpx 0;
		font-size: $uni-font-size-base;
		color: rgba(39, 40, 50, 0.4);
		line-height: 40rpx;
	}

	.search-bt {
		display: inline-block;
		width: 240rpx;
		height: 96rpx;
		background-color: $uni-color-primary;
		box-shadow: 0 52rpx 36rpx -32rpx rgba(255, 228, 49, 0.4);
		border-radius: 48rpx;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		line-height: 96rpx;
	}
}

.friends-list {
	height: 96rpx;
	padding: 16rpx $uni-spacing-col-base;

	&:active {
		background-color: $uni-bg-color-grey;
	}

	.friends-list-l {
		position: relative;
		float: left;

		image {
			width: 96rpx;
			height: 96rpx;
			border-radius: $uni-border-radius-base;
			background-color: $uni-color-primary;
		}

		.tip {
			position: absolute;
			z-index: 10;
			top: -8rpx;
			left: 68rpx;
			min-width: 20rpx;
			padding: 0 8rpx;
			background-color: $uni-color-warning;
			border-radius: 18rpx;
			font-size: $uni-font-size-sm;
			color: $uni-text-color-inverse;
			line-height: 36rpx;
			text-align: center;
		}
	}

	.friends-list-r {
		padding-left: 128rpx;

		.top {
			height: 50rpx;

			.name {
				float: left;
				font-size: 36rpx;
				font-weight: 400;
				color: $uni-text-color;
				line-height: 50rpx;
			}

			.time {
				float: right;
				font-size: $uni-font-size-sm;
				color: $uni-text-color-disable;
				line-height: 50rpx;
			}
		}

		.news {
			font-size: $uni-font-size-base;
			color: $uni-text-color-grey;
			line-height: 40rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
		}
	}
}
</style>
