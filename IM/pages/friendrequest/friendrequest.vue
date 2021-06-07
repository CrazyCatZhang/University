<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne"><image src="../../static/images/common/back.png" mode="" class="back-img"></image></view>
			<view class="top-bar-center"><view class="title">好友请求</view></view>
			<view class="top-bar-right"><view class="pice"></view></view>
		</view>
		<view class="main">
			<view class="requester" v-for="(item,index) in requesters" :key="index">
				<view class="request-top">
					<view class="reject btn">拒绝</view>
					<view class="header-img"><image :src="item.imgurl" mode=""></image></view>
					<view class="agree btn">同意</view>
				</view>
				<view class="request-center">
					<view class="title">{{item.name}}</view>
					<view class="time">{{changeTime(item.time)}}</view>
				</view>
				<view class="notic">
					<text>留言：</text>
					{{item.news}}
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
			requesters: []
		};
	},
	onLoad() {
		this.getRequesters();
	},
	methods: {
		changeTime: function(date) {
			return method.dateTime(date);
		},
		getRequesters: function() {
			this.requesters = datas.friends();
			for (var i = 0; i < this.requesters.length; i++) {
				this.requesters[i].imgurl = '../../static/images/img/' + this.requesters[i].imgurl;
			}
			console.log(this.requesters);
		},
		backOne: function() {
			uni.navigateBack({
				delta: 1
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
