<template>
	<view>
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne"><image src="../../static/images/common/back.png" mode="" class="back-img"></image></view>
			<view class="top-bar-right">
				<view class="more-img"><image src="../../static/images/userhome/more.png" mode=""></image></view>
			</view>
		</view>
		<view class="bg">
			<view class="bg-white"></view>
			<image src="../../static/images/img/three.png" mode="aspectFill" class="bg-img"></image>
		</view>
		<view class="main">
			<view class="user-header">
				<view class="sex" :style="{ background: sexBg }"><image src="../../static/images/userhome/female.png" mode=""></image></view>
				<image src="../../static/images/img/three.png" mode="aspectFill" class="user-img"></image>
			</view>
			<view class="user-imf">
				<view class="name">{{ user.name }}</view>
				<view class="nick">昵称：{{ user.nick }}</view>
				<view class="intro">{{ user.intro }}</view>
			</view>
		</view>
		<view class="bottom-bar"><view class="bottom-btn">加为好友</view></view>
		<view class="add-misg" :style="{ height: addHeight + 'px' }">
			<view class="name">{{ user.name }}</view>
			<textarea :value="myname + '请求添加好友~'" maxlength="120" placeholder="" class="add-main" />
		</view>
		<view class="add-bt">
			<view class="close">取消</view>
			<view class="send">发送</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			sexBg: 'rgba(255, 93, 91, 1)',
			myname: '春雨',
			addHeight: '',
			user: {
				name: '秋风',
				nick: '秋之果',
				intro:
					'有时会讨厌不甘平庸却又不好好努力的自己 觉得自己不够好 羡慕别人闪闪发光 我们试着长大 做努力爬的蜗牛或坚持飞的笨鸟 一路跌跌撞撞，然后遍体鳞伤 总有一天 你会站在最亮的地方 活成自己曾经渴望的模样'
			}
		};
	},
	onReady: function() {
		this.getElementStyle();
	},
	methods: {
		backOne: function() {
			uni.navigateBack({
				delta: 1
			});
		},
		getElementStyle: function() {
			const query = uni.createSelectorQuery().in(this);
			query
				.select('.bg')
				.boundingClientRect(data => {
					console.log('得到布局位置信息' + JSON.stringify(data));
					console.log('节点离页面顶部的距离为' + data.top);
					this.addHeight = data.height - 186;
				})
				.exec();
		}
	}
};
</script>

<style lang="scss">
@import '../../commons/css/common.scss';

.bg {
	position: fixed;
	z-index: -2;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;

	.bg-white {
		width: 100%;
		height: 100%;
		// background-color: #eee;
	}

	.bg-img {
		position: absolute;
		z-index: -1;
		left: -10rpx;
		top: -10rpx;
		width: 110%;
		height: 110%;
		filter: blur(16px);
		opacity: 0.4;
	}
}

.main {
	padding-top: 148rpx;
	text-align: center;

	.user-header {
		position: relative;
		width: 412rpx;
		height: 412rpx;
		margin: 0 auto;

		.sex {
			position: absolute;
			z-index: 11;
			bottom: 22rpx;
			right: 22rpx;
			width: 64rpx;
			height: 64rpx;
			// background-color: rgba(255, 93, 91, 1);
			border-radius: $uni-border-radius-circle;

			image {
				padding: 16rpx;
				width: 32rpx;
				height: 32rpx;
			}
		}

		.user-img {
			z-index: 10;
			width: 400rpx;
			height: 400rpx;
			border-radius: 48rpx;
			border: 6rpx solid rgba(255, 255, 255, 1);
		}
	}

	.user-imf {
		padding-top: 42rpx;

		.name {
			font-size: 52rpx;
			color: $uni-text-color;
			line-height: 74rpx;
		}

		.nick {
			font-size: $uni-font-size-base;
			color: $uni-text-color;
			line-height: 40rpx;
		}

		.intro {
			padding: 20rpx 100rpx;
			font-size: $uni-font-size-base;
			font-weight: 300;
			color: $uni-text-color;
			line-height: 48rpx;
		}
	}
}

.bottom-bar {
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 104rpx;
	box-sizing: border-box;
	padding: 12rpx $uni-spacing-col-base;

	.bottom-btn {
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		font-size: $uni-font-size-lg;
		background-color: $uni-color-primary;
		color: $uni-text-color;
		border-radius: $uni-border-radius-sm;
	}
}

.add-misg {
	position: fixed;
	bottom: 0;
	width: 100%;
	box-sizing: border-box;
	padding: 0 56rpx;
	background-color: rgba(255, 255, 255, 1);
	border-radius: 40rpx 40rpx 0 0;

	.name {
		padding: 168rpx 0 40rpx;
		font-size: 52rpx;
		color: $uni-text-color;
		line-height: 74rpx;
	}

	.add-main {
		padding: 18rpx 22rpx;
		box-sizing: border-box;
		width: 100%;
		height: 420rpx;
		background-color: $uni-bg-color-grey;
		border-radius: $uni-border-radius-base;
		font-size: $uni-font-size-lg;
		color: $uni-text-color;
		line-height: 44rpx;
	}
}

.add-bt {
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 104rpx;
	box-sizing: border-box;
	padding: 12rpx $uni-spacing-col-base;
	display: flex;

	.close {
		// flex: 0;
		text-align: center;
		width: 172rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: $uni-font-size-lg;
		background-color: $uni-bg-color-hover;
		color: $uni-text-color;
		border-radius: $uni-border-radius-sm;
	}

	.send {
		margin-left: $uni-spacing-col-base;
		flex: auto;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		font-size: $uni-font-size-lg;
		background-color: $uni-color-primary;
		color: $uni-text-color;
		border-radius: $uni-border-radius-sm;
	}
}
</style>
