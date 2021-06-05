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
				<input type="text" placeholder="用户名/邮箱" class="user" placeholder-style="color:#aaa;font-weight:400;" @blur="getUser"/>
				<input type="password" placeholder="密码" class="pwd" placeholder-style="color:#aaa;font-weight:400;" @blur="getPwd"/>
			</view>
			<view class="tips">
				用户名或密码错误！！！
			</view>
		</view>
		<view class="submit" @tap="login">登录</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			user: '',
			pwd: ''
		};
	},
	methods: {
		toRegistered: function() {
			uni.navigateTo({
			    url: '../registered/registered'
			});
		},
		
		getUser: function(e) {
			this.user = e.detail.value;
		},
		
		getPwd: function(e) {
			this.pwd = e.detail.value;
		},
		
		login: function() {
			if(this.user && this.pwd) {
				console.log("Submit");
			}
		}
	}
};
</script>

<style lang="scss">
.content {
	padding-top: var(--status-bar-height);
}

.top-bar {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 88rpx;
	z-index: 1000;
	// box-sizing: border-box;
	padding-top: var(--status-bar-height);
	background: $uni-bg-color;

	.top-bar-right {
		float: right;
		padding-right: 32rpx;

		.text {
			font-size: $uni-font-size-lg;
			font-weight: 500;
			color: $uni-text-color;
			line-height: 88rpx;
		}
	}
}

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
	box-shadow: 0 50rpx 32rpx -36rpx rgba(255,228,49,0.4);
	border-radius: 48rpx;
	font-size: $uni-font-size-lg;
	font-weight: 500;
	color: $uni-text-color;
	line-height: 96rpx;
	text-align: center;
}
</style>
