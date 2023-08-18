

const modelList = [
	{
		name: '人物(女)',
		fileType: 'glb',
		id: 3,
		animation: true,
		filePath: 'threeFile/glb/glb-3.glb',
		icon: require('@/assets/model-icon/12.png')
	},

	{
		name: '汽车人',
		fileType: 'glb',
		id: 6,
		animation: true,
		filePath: 'threeFile/glb/glb-6.glb',
		scale: 1.3,
		icon: require('@/assets/model-icon/13.png')
	},

	{
		name: '钢铁侠',
		fileType: 'glb',
		id: 7,
		animation: false,
		filePath: 'threeFile/glb/glb-7.glb',
		icon: require('@/assets/model-icon/2.png')
	},
	{
		name: '奥创',
		fileType: 'glb',
		id: 9,
		animation: false,
		filePath: 'threeFile/glb/glb-9.glb',
		icon: require('@/assets/model-icon/4.png')

	},
	{
		name: '蚁人',
		fileType: 'glb',
		id: 10,
		animation: false,
		filePath: 'threeFile/glb/glb-10.glb',
		icon: require('@/assets/model-icon/1.png')
	},
	{
		name: '蜘蛛侠',
		fileType: 'glb',
		id: 11,
		animation: false,
		filePath: 'threeFile/glb/glb-11.glb',
		icon: require('@/assets/model-icon/5.png')
	},
	{
		name: '美国队长',
		fileType: 'glb',
		id: 12,
		animation: false,
		filePath: 'threeFile/glb/glb-12.glb',
		icon: require('@/assets/model-icon/6.png')
	},

	{
		name: '动漫人物(女2)',
		fileType: 'glb',
		id: 16,
		animation: true,
		filePath: 'threeFile/glb/glb-16.glb',
		icon: require('@/assets/model-icon/14.png')
	},

	{
		name: '蜘蛛侠(2)',
		fileType: 'glb',
		id: 17,
		animation: true,
		scale: 1.2,
		filePath: 'threeFile/glb/glb-17.glb',
		icon: require('@/assets/model-icon/15.png')
	},
	{
		name: '鹿',
		fileType: 'glb',
		id: 18,
		animation: true,
		filePath: 'threeFile/glb/glb-18.glb',
		icon: require('@/assets/model-icon/17.png')
	},

	{
		name: '浣熊',
		fileType: 'glb',
		id: 22,
		animation: false,
		filePath: 'threeFile/glb/glb-22.glb',
		icon: require('@/assets/model-icon/9.png')

	},
	{
		name: '恶魔',
		fileType: 'glb',
		id: 24,
		animation: false,
		filePath: 'threeFile/glb/glb-24.glb',
		icon: require('@/assets/model-icon/11.png')
	},
	{
		name: '牛头酋长',
		fileType: 'glb',
		map: require('@/assets/maps/1.png'),
		id: 25,
		animation: true,
		filePath: 'threeFile/glb/glb-25.glb',
		icon: require('@/assets/model-icon/18.png')
	},
	{
		name: '火男',
		fileType: 'glb',
		id: 26,
		animation: true,
		filePath: 'threeFile/glb/glb-26.glb',
		scale: .02,
		icon: require('@/assets/model-icon/16.png')
	},
	{
		name: '龙',
		fileType: 'glb',
		map: require('@/assets/maps/4.png'),
		id: 29,
		animation: true,
		scale: 1.2,
		position: {
			x: 0,
			y: -3.7,
			z: 0
		},
		filePath: 'threeFile/glb/glb-29.glb',
		icon: require('@/assets/model-icon/21.png')
	},
]

const backgrundList = [
	{
		id: 1,
		url: require('@/assets/image/model-bg-1.jpg')
	},
	{
		id: 2,
		url: require('@/assets/image/model-bg-2.jpeg')
	},
	{
		id: 3,
		url: require('@/assets/image/model-bg-3.jpg')
	},
	{
		id: 4,
		url: require('@/assets/image/model-bg-4.jpg')
	},
	{
		id: 5,
		url: require('@/assets/image/model-bg-5.png')
	},
	{
		id: 6,
		url: require('@/assets/image/model-bg-6.jpg')
	},
	{
		id: 7,
		url: require('@/assets/image/model-bg-7.jpg')
	},
	{
		id: 8,
		url: require('@/assets/image/model-bg-8.jpg')
	},
	{
		id: 9,
		url: require('@/assets/image/model-bg-9.jpg')
	},
	{
		id: 10,
		url: require('@/assets/image/model-bg-10.jpg')
	},
	{
		id: 11,
		url: require('@/assets/image/model-bg-11.jpg')
	},
	{
		id: 15,
		url: require('@/assets/image/model-bg-15.jpg')
	},
	{
		id: 16,
		url: require('@/assets/image/model-bg-16.jpg')
	},
	{
		id: 17,
		url: require('@/assets/image/model-bg-17.jpg')
	},
	{
		id: 18,
		url: require('@/assets/image/model-bg-18.jpg')
	},
]

let viewImageList = []
for (let i = 0; i <= 14; i++) {
	const image = {
		id: i,
		url: require(`@/assets/image/view-${i + 1}.png`),
		file:`threeFile/hdr/${i+1}.hdr`
	}
	viewImageList.push(image)
}

const mapImageList =[
	{
		id: Math.random()*100,
		url: require(`@/assets/maps/5.jpg`)
	},
	{
		id: Math.random()*100,
		url: require(`@/assets/maps/6.jpg`)
	},
	{
		id: Math.random()*100,
		url: require(`@/assets/maps/7.jpg`)
	},
	{
		id: Math.random()*100,
		url: require(`@/assets/maps/8.jpg`)
	},
	{
		id: Math.random()*100,
		url: require(`@/assets/maps/9.jpg`)
	},
	{
		id: Math.random()*100,
		url: require(`@/assets/maps/10.jpg`)
	},
	{
		id: Math.random()*100,
		url: require(`@/assets/maps/11.png`)
	},
	{
		id: Math.random()*100,
		url: require(`@/assets/maps/12.jpg`)
	},
	{
		id: Math.random()*100,
		url: require(`@/assets/maps/13.jpg`)
	},
	{
		id: Math.random()*100,
		url: require(`@/assets/maps/14.png`)
	},
	{
		id: Math.random()*100,
		url: require(`@/assets/maps/16.jpg`)
	},
	{
		id: Math.random()*100,
		url: require(`@/assets/maps/17.jpg`)
	},
	{
		id: Math.random()*100,
		url: require(`@/assets/maps/18.jpg`)
	},
	{
		id: Math.random()*100,
		url: require(`@/assets/maps/19.jpg`)
	},
	...viewImageList
]

export { modelList, backgrundList, viewImageList ,mapImageList }