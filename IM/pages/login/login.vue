<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-right" @tap="toRegistered()"><view class="text">注册</view></view>
		</view>
		<view class="logo"><image src="../../static/images/sign/logo1.png" mode=""></image></view>
		<view class="main">
			<view class="title">登录</view>
			<view class="slogan">您好，欢迎来到yike！</view>
			<view class="inputs">
				<input type="text" v-model="user" placeholder="用户名/邮箱" class="user" placeholder-style="color:#aaa;font-weight:400;" />
				<input type="password" v-model="pwd" placeholder="密码" class="pwd" placeholder-style="color:#aaa;font-weight:400;" />
			</view>
			<view class="tips" :style="{ display: mon }">用户名或密码错误！！！</view>
		</view>
		<view class="submit" @tap="login">登录</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			user: '',
			pwd: '',
			mon: 'none'
		};
	},
	onLoad: function(e) {
		if (e.user) {
			this.user = e.user;
			uni.showToast({
				title: '注册成功请登录',
				icon: 'none',
				duration: 2000
			});
		} else if (e.name) {
			this.user = e.name;
			uni.showToast({
				title: '登录过期请重新登录',
				icon: 'none',
				duration: 2000
			});
		} else if (e.cgpwd) {
			this.user = e.cgpwd;
			uni.showToast({
				title: '登录过期请重新登录',
				icon: 'none',
				duration: 2000
			});
		}
	},
	methods: {
		toRegistered: function() {
			uni.navigateTo({
				url: '../registered/registered'
			});
		},

		login: function() {
			if (this.user && this.pwd) {
				uni.request({
					url: this.serverUrl + '/signin/match',
					data: {
						data: this.user,
						pwd: this.pwd
					},
					method: 'POST',
					success: data => {
						let status = data.data.status;
						if (status == 200) {
							//登录成功
							let res = data.data.back;
							this.mon = 'none';
							//本地存储用户信息
							try {
								uni.setStorageSync('user', { id: res.id, name: res.name, imgurl: res.imgurl, token: res.token });
							} catch (e) {
								// error
								console.log('数据存储出错');
							}

							uni.navigateTo({
								url: '../index/index'
							});
						} else if (status == 400) {
							//匹配失败
							this.mon = 'block';
							this.pwd = '';
						} else if (status == 500) {
							//服务器失败
							uni.showToast({
								title: '服务器出错啦！',
								icon: 'none',
								duration: 2000
							});
						}
					}
				});
			}
		}
	}
};
</script>

<style lang="scss">
@import '../../commons/css/common.scss';

.logo {
	text-align: center;
	image {
		padding-top: 256rpx;
		width: 194rpx;
		height: 92rpx;
		margin: 0 auto;
	}
}

.main {
	padding: 54rpx $uni-spacing-row-lg 120rpx;

	.title {
		font-size: 56rpx;
		font-weight: 500;
		color: $uni-text-color;
		line-height: 80rpx;
	}

	.slogan {
		font-size: 40rpx;
		color: $uni-text-color-grey;
		line-height: 56rpx;
	}

	.inputs {
		padding-top: 8rpx;

		input {
			padding-top: 40rpx;
			height: 88rpx;
			font-size: $uni-font-size-lg;
			font-weight: 500;
			color: $uni-text-color;
			line-height: 88rpx;
			border-bottom: 1px solid $uni-border-color;
		}
	}

	.tips {
		float: left;
		font-size: $uni-font-size-lg;
		color: $uni-color-warning;
		line-height: 56rpx;
	}
}

.submit {
	width: 520rpx;
	height: 96rpx;
	margin: 0 auto;
	background-color: $uni-color-primary;
	box-shadow: 0 50rpx 32rpx -36rpx rgba(255, 228, 49, 0.4);
	border-radius: 48rpx;
	font-size: $uni-font-size-lg;
	font-weight: 500;
	color: $uni-text-color;
	line-height: 96rpx;
	text-align: center;
}
</style>
