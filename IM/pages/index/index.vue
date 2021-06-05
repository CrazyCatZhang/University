<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left"><image src="../../static/images/img/four.png" mode=""></image></view>
			<view class="top-bar-center"><image class="logo" src="../../static/images/index/logo.png" mode=""></image></view>
			<view class="top-bar-right">
				<view class="search"><image src="../../static/images/index/search.png" mode=""></image></view>
				<view class="add"><image src="../../static/images/index/add.png" mode=""></image></view>
			</view>
		</view>
		<view class="main">
			<view class="friends">
				<view class="friends-list">
					<view class="friends-list-l">
						<text class="tip">1</text>
						<image src="../../static/images/index/apply.png" mode=""></image>
					</view>
					<view class="friends-list-r">
						<view class="top">
							<view class="name">好友申请</view>
							<view class="time">13:43</view>
						</view>
						<view class="news">茫茫人海，相聚便是缘分</view>
					</view>
				</view>
			</view>
			<view class="friends">
				<view class="friends-list" v-for="(item, index) in friends" :key="index">
					<view class="friends-list-l">
						<text class="tip" v-if="item.tip > 0">{{ item.tip }}</text>
						<image :src="item.imgurl" mode=""></image>
					</view>
					<view class="friends-list-r">
						<view class="top">
							<view class="name">{{ item.name }}</view>
							<view class="time">{{ changeTime(item.time) }}</view>
						</view>
						<view class="news">{{ item.news }}</view>
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
			friends: []
		};
	},
	onLoad() {
		this.getFriends();
	},
	methods: {
		changeTime: function(date) {
			return method.dateTime(date);
		},

		getFriends: function() {
			this.friends = datas.friends();
			for (var i = 0; i < this.friends.length; i++) {
				this.friends[i].imgurl = '../../static/images/img/' + this.friends[i].imgurl;
			}
			console.log(this.friends);
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
	// width: calc(100% - 32rpx);
	padding-top: 104rpx;
	padding-bottom: $uni-spacing-col-base;
	// border: 1px solid red;
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
