export default {
	friends: function() {
		let friendsArr = [{
				id: 1,
				imgurl: 'four.png',
				tip: 2,
				name: '大海',
				email: 'dahai@163.com',
				time: new Date(),
				news: 'I am leaving this comment so that even after months and years later ',
			},
			{
				id: 2,
				imgurl: 'one.png',
				tip: 2223,
				name: '山川',
				email: 'shanchuan2@163.com',
				time: new Date(),
				news: 'I am leaving this comment so that even after months and years later ',
			},
			{
				id: 3,
				imgurl: 'two.png',
				tip: 2,
				name: '河流',
				email: 'heliu@163.com',
				time: new Date(),
				news: 'I am leaving this comment so that even after months and years later ',
			},
			{
				id: 4,
				imgurl: 'three.png',
				tip: 2,
				name: '溪流',
				email: 'xiliu@163.com',
				time: new Date(),
				news: 'I am leaving this comment so that even after months and years later ',
			},
			{
				id: 5,
				imgurl: 'four.png',
				tip: 2,
				name: '大海',
				email: 'dahai5@163.com',
				time: new Date(),
				news: 'I am leaving this comment so that even after months and years later ',
			},
			{
				id: 6,
				imgurl: 'one.png',
				tip: 2,
				name: '山川',
				email: 'shanchuan6@163.com',
				time: new Date(),
				news: 'I am leaving this comment so that even after months and years later ',
			},
			{
				id: 7,
				imgurl: 'two.png',
				tip: 2,
				name: '河流',
				email: 'heliu@163.com',
				time: new Date(),
				news: 'I am leaving this comment so that even after months and years later ',
			},
			{
				id: 8,
				imgurl: 'three.png',
				tip: 2,
				name: '溪流',
				email: 'xiliu8@163.com',
				time: new Date(),
				news: 'I am leaving this comment so that even after months and years later ',
			},
			{
				id: 9,
				imgurl: 'four.png',
				tip: 2,
				name: '大海',
				email: 'dahai@163.com',
				time: new Date(),
				news: 'I am leaving this comment so that even after months and years later ',
			},
			{
				id: 10,
				imgurl: 'one.png',
				tip: 2,
				name: '山川',
				email: 'shanchuan@163.com',
				time: new Date(),
				news: 'I am leaving this comment so that even after months and years later ',
			},
			{
				id: 11,
				imgurl: 'two.png',
				tip: 2,
				name: '河流',
				email: 'heliu@163.com',
				time: new Date(),
				news: 'I am leaving this comment so that even after months and years later ',
			},
			{
				id: 12,
				imgurl: 'three.png',
				tip: 2,
				name: '溪流',
				email: 'xiliu@163.com',
				time: new Date(),
				news: 'I am leaving this comment so that even after months and years later ',
			},
		];
		return friendsArr;
	},

	//好友关系
	isFriend: function() {
		let isfriend = [{
				userid: 1,
				friend: 2
			},
			{
				userid: 1,
				friend: 5
			},
			{
				userid: 1,
				friend: 6
			},
			{
				userid: 1,
				friend: 8
			},
		];
		return isfriend;
	},

	//聊天消息
	message: function() {
		let msgs = [{
				id: 'b', //用户id
				imgurl: 'two.png',
				message: {
					name: '天安门城楼售票处',
					address: '东长安街天安门城楼内',
					latitude: '39.909473',
					longitude: '116.39730899999999'
				},
				types: 3, //内容类型（0文字，1图片链接，2音频连接...)
				time: new Date(), //发送时间
				tip: 18,
			},
			{
				id: 'a', //用户id
				imgurl: 'one.png',
				message: {
					name: '天安门城楼售票处天安门城楼售票处',
					address: '东长安街天安门城楼内东长安街天安门城楼内',
					latitude: '39.909473',
					longitude: '116.39730899999999'
				},
				types: 3, //内容类型（0文字，1图片链接，2音频连接...)
				time: new Date(), //发送时间
				tip: 17,
			},
			{
				id: 'a', //用户id
				imgurl: 'one.png',
				message: {
					voice: 'a',
					time: 60
				},
				types: 2, //内容类型（0文字，1图片链接，2音频连接...)
				time: new Date(), //发送时间
				tip: 15,
			},
			{
				id: 'b', //用户id
				imgurl: 'two.png',
				message: {
					voice: 'a',
					time: 20
				},
				types: 2, //内容类型（0文字，1图片链接，2音频连接...)
				time: new Date(), //发送时间
				tip: 16,
			},
			{
				id: 'a', //用户id
				imgurl: 'one.png',
				message: '世界那么大 有人给你难堪 有人为你解围 爱你的人永远知道怎么爱你',
				types: 0, //内容类型（0文字，1图片链接，2音频连接...)
				time: new Date() - 1000, //发送时间
				tip: 0,
			},
			{
				id: 'a', //用户id
				imgurl: 'one.png',
				message: '世界那么大 有人给你难堪 有人为你解围 爱你的人永远知道怎么爱你',
				types: 0, //内容类型（0文字，1图片链接，2音频连接...)
				time: new Date() - 1000 * 16, //发送时间
				tip: 1,
			},
			{
				id: 'b', //用户id
				imgurl: 'two.png',
				message: '世界那么大 有人给你难堪 有人为你解围 爱你的人永远知道怎么爱你',
				types: 0, //内容类型（0文字，1图片链接，2音频连接...)
				time: new Date() - 1000 * 60, //发送时间
				tip: 2,
			},
			{
				id: 'a', //用户id
				imgurl: 'one.png',
				message: '世界那么大 有人给你难堪 有人为你解围 爱你的人永远知道怎么爱你',
				types: 0, //内容类型（0文字，1图片链接，2音频连接...)
				time: new Date() - 1000 * 60 * 36, //发送时间
				tip: 3,
			},
			{
				id: 'a', //用户id
				imgurl: 'one.png',
				message: 'one.png',
				types: 1, //内容类型（0文字，1图片链接，2音频连接...)
				time: new Date() - 1000 * 60 * 40, //发送时间
				tip: 4,
			},
			{
				id: 'b', //用户id
				imgurl: 'one.png',
				message: 'si.jpg',
				types: 1, //内容类型（0文字，1图片链接，2音频连接...)
				time: new Date() - 1000 * 60 * 57, //发送时间
				tip: 5,
			},
			{
				id: 'a', //用户id
				imgurl: 'one.png',
				message: 'wu.jpg',
				types: 1, //内容类型（0文字，1图片链接，2音频连接...)
				time: new Date() - 1000 * 60 * 58, //发送时间
				tip: 6,
			},
			{
				id: 'b', //用户id
				imgurl: 'one.png',
				message: '世界那么大 有人给你难堪 有人为你解围 爱你的人永远知道怎么爱你',
				types: 0, //内容类型（0文字，1图片链接，2音频连接...)
				time: new Date() - 1000 * 60 * 60, //发送时间
				tip: 7,
			},
			{
				id: 'b', //用户id
				imgurl: 'one.png',
				message: '世界那么大 有人给你难堪 有人为你解围 爱你的人永远知道怎么爱你',
				types: 0, //内容类型（0文字，1图片链接，2音频连接...)
				time: new Date() - 1000 * 60 * 58 * 24, //发送时间
				tip: 8,
			},
			{
				id: 'a', //用户id
				imgurl: 'one.png',
				message: '世界那么大 有人给你难堪 有人为你解围 爱你的人永远知道怎么爱你',
				types: 0, //内容类型（0文字，1图片链接，2音频连接...)
				time: new Date() - 1000 * 60 * 60 * 24, //发送时间
				tip: 9,
			},
			{
				id: 'a', //用户id
				imgurl: 'one.png',
				message: 'er.jpg',
				types: 1, //内容类型（0文字，1图片链接，2音频连接...)
				time: new Date() - 1000 * 60 * 60 * 24, //发送时间
				tip: 10,
			},
			{
				id: 'b', //用户id
				imgurl: 'one.png',
				message: '世界那么大 有人给你难堪 有人为你解围 爱你的人永远知道怎么爱你',
				types: 0, //内容类型（0文字，1图片链接，2音频连接...)
				time: new Date() - 1000 * 60 * 60 * 24, //发送时间
				tip: 11,
			},
			{
				id: 'a', //用户id
				imgurl: 'one.png',
				message: 'yi.jpg',
				types: 1, //内容类型（0文字，1图片链接，2音频连接...)
				time: new Date() - 1000 * 60 * 60 * 240, //发送时间
				tip: 12,
			},
			{
				id: 'b', //用户id
				imgurl: 'one.png',
				message: '世界那么大 有人给你难堪 有人为你解围 爱你的人永远知道怎么爱你',
				types: 0, //内容类型（0文字，1图片链接，2音频连接...)
				time: new Date() - 1000 * 60 * 60 * 241, //发送时间
				tip: 13,
			},
			{
				id: 'b', //用户id
				imgurl: 'one.png',
				message: '世界那么大 有人给你难堪 有人为你解围 爱你的人永远知道怎么爱你',
				types: 0, //内容类型（0文字，1图片链接，2音频连接...)
				time: new Date() - 1000 * 60 * 60 * 241, //发送时间
				tip: 14,
			},
		];
		return msgs;
	}
}
