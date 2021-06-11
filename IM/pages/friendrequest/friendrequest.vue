<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne"><image src="../../static/images/common/back.png" mode="" class="back-img"></image></view>
			<view class="top-bar-center"><view class="title">好友请求</view></view>
			<view class="top-bar-right"><view class="pice"></view></view>
		</view>
		<view class="main">
			<view class="requester" v-for="(item, index) in requesters" :key="index">
				<view class="request-top">
					<view class="reject btn" @tap="refuse(item.id)">拒绝</view>
					<view class="header-img"><image :src="item.imgurl" mode=""></image></view>
					<view class="agree btn" @tap="agree(item.id)">同意</view>
				</view>
				<view class="request-center">
					<view class="title">{{ item.name }}</view>
					<view class="time">{{ changeTime(item.lastTime) }}</view>
				</view>
				<view class="notic">
					<text>留言：</text>
					{{ item.msg }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import method from '../../commons/js/method.js';

export default {
	data() {
		return {
			requesters: [],
			uid: '',
			myname: '',
			token: ''
		};
	},
	onLoad() {
		this.getStorage();
		this.friendRquest();
	},
	methods: {
		changeTime: function(date) {
			return method.dateTime(date);
		},
		backOne: function() {
			uni.navigateBack({
				delta: 1
			});
		},
		//获取登录成功的本地缓存数据
		getStorage: function() {
			try {
				const value = uni.getStorageSync('user');
				if (value) {
					this.uid = value.id;
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
					// console.log(data);
					let status = data.data.status;
					if (status == 200) {
						let res = data.data.result;
						for (var i = 0; i < res.length; i++) {
							res[i].imgurl = this.serverUrl + res[i].imgurl;
							this.getLeave(res, i);
						}
						this.requesters = res;
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
		//获取留言
		getLeave: function(arr, i) {
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
		//拒绝好友申请
		refuse: function(fid) {
			uni.request({
				url: this.serverUrl + '/friend/deletefriend',
				data: {
					uid: this.uid,
					fid: fid,
					token: this.token
				},
				method: 'POST',
				success: data => {
					// console.log(data);
					let status = data.data.status;
					console.log(status);
					if (status == 200) {
						for (var i = 0; i < this.requesters.length; i++) {
							if(this.requesters[i].id == fid) {
								this.requesters.splice(i,1);
							}
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
		//同意好友申请
		agree: function(fid) {
			uni.request({
				url: this.serverUrl + '/friend/updatefriendstate',
				data: {
					uid: this.uid,
					fid: fid,
					token: this.token
				},
				method: 'POST',
				success: data => {
					// console.log(data);
					let status = data.data.status;
					console.log(status);
					if (status == 200) {
						for (var i = 0; i < this.requesters.length; i++) {
							if(this.requesters[i].id == fid) {
								this.requesters.splice(i,1);
							}
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
	}
};
</script>

<style lang="scss">
@import '../../commons/css/common.scss';

.top-bar {
	background: rgba(255, 255, 255, 0.96);
	border-bottom: 1px solid $uni-border-color;
}

.main {
	padding: 108rpx $uni-spacing-col-base;

	.requester {
		margin-top: 112rpx;
		padding: $uni-spacing-col-base;
		background-color: rgba(255, 255, 255, 1);
		box-shadow: 0 24rpx 64rpx -8rpx rgba(0, 0, 0, 0.1);
		border-radius: $uni-border-radius-base;
	}

	.request-top {
		display: flex;
		flex-direction: row;

		.btn {
			flex: none;
			text-align: center;
			width: 160rpx;
			height: 64rpx;
			background-color: rgba(255, 93, 91, 0.1);
			border-radius: 40rpx;
			font-size: $uni-font-size-lg;
			line-height: 64rpx;
		}

		.reject {
			color: $uni-color-warning;
			background-color: rgba(255, 93, 91, 0.1);
		}

		.agree {
			color: $uni-text-color;
			background-color: $uni-color-primary;
		}

		.header-img {
			flex: auto;
			text-align: center;
			margin-top: -104rpx;

			image {
				width: 144rpx;
				height: 144rpx;
				border-radius: 50%;
			}
		}
	}

	.request-center {
		text-align: center;
		padding-top: 20rpx;
		padding-bottom: 40rpx;

		.title {
			font-size: 36rpx;
			font-weight: 500;
			color: $uni-text-color;
			line-height: 50rpx;
		}

		.time {
			font-size: $uni-font-size-sm;
			color: $uni-text-color-disable;
			line-height: 34rpx;
		}
	}

	.notic {
		padding: $uni-spacing-row-sm $uni-spacing-col-base;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
		background-color: $uni-bg-color-grey;
		border-radius: $uni-border-radius-base;
		line-height: 40rpx;
	}
}
</style>
