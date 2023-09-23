

const modelList = [
	{
		name: '人物(女)',
		key: 'character',
		fileType: 'glb',
		id: 3,
		animation: true,
		filePath: 'threeFile/glb/glb-3.glb',
		icon: require('@/assets/model-icon/12.png')
	},

	{
		name: '汽车人',
		key: 'autobots',
		fileType: 'glb',
		id: 6,
		animation: true,
		filePath: 'threeFile/glb/glb-6.glb',
		scale: 1.3,
		icon: require('@/assets/model-icon/13.png')
	},

	{
		name: '钢铁侠',
		key: 'IronMan',
		fileType: 'glb',
		id: 7,
		animation: false,
		filePath: 'threeFile/glb/glb-7.glb',
		icon: require('@/assets/model-icon/2.png')
	},

	{
		name: '人物（男）',
		key: 'characterMan',
		fileType: 'glb',
		id: 8,
		animation: false,
		filePath: 'threeFile/glb/glb-8.glb',
		icon: require('@/assets/model-icon/3.png')
	},
	{
		name: '变形金刚（3）',
		key: 'transformers-3',
		fileType: 'glb',
		id: 9,
		animation: false,
		filePath: 'threeFile/glb/glb-9.glb',
		icon: require('@/assets/model-icon/4.png'),
		decomposeName: 'transformers_3'
	},
	{
		name: '变形金刚（1）',
		key: 'transformers-1',
		fileType: 'glb',
		id: 10,
		animation: false,
		filePath: 'threeFile/glb/glb-10.glb',
		icon: require('@/assets/model-icon/1.png'),
		decomposeName: 'transformers_1'
	},
	{
		name: '人物（女）2',
		key: 'character-2',
		fileType: 'glb',
		id: 11,
		animation: false,
		filePath: 'threeFile/glb/glb-11.glb',
		icon: require('@/assets/model-icon/5.png')
	},
	{
		name: '变形金刚(4)',
		key: 'transformers-4',
		fileType: 'glb',
		id: 12,
		animation: false,
		filePath: 'threeFile/glb/glb-12.glb',
		icon: require('@/assets/model-icon/6.png')
	},

	{
		name: '动漫人物(女2)',
		key: 'Anime-2',
		fileType: 'glb',
		id: 16,
		animation: true,
		filePath: 'threeFile/glb/glb-16.glb',
		icon: require('@/assets/model-icon/14.png')
	},

	{
		name: '直升机',
		key: 'aircraft',
		fileType: 'glb',
		id: 17,
		animation: true,
		scale: .2,
		filePath: 'threeFile/glb/glb-17.glb',
		icon: require('@/assets/model-icon/15.png')
	},
	{
		name: '鹿',
		key: 'deer',
		fileType: 'glb',
		id: 18,
		animation: true,
		filePath: 'threeFile/glb/glb-18.glb',
		icon: require('@/assets/model-icon/17.png')
	},

	{
		name: '变形金刚（2）',
		key: 'transformers-2',
		fileType: 'glb',
		id: 22,
		animation: false,
		filePath: 'threeFile/glb/glb-22.glb',
		icon: require('@/assets/model-icon/9.png'),
		decomposeName: 'transformers_2'
	},
	{
		name: '恶魔',
		key: 'emo-2',
		fileType: 'glb',
		id: 24,
		animation: false,
		filePath: 'threeFile/glb/glb-24.glb',
		icon: require('@/assets/model-icon/11.png')
	},
	{
		name: '牛头酋长',
		key: 'taurenchieftain',
		fileType: 'glb',
		map: require('@/assets/maps/1.png'),
		id: 25,
		animation: true,
		filePath: 'threeFile/glb/glb-25.glb',
		icon: require('@/assets/model-icon/18.png')
	},
	{
		name: '火男',
		key: 'hyottoko',
		fileType: 'glb',
		id: 26,
		animation: true,
		filePath: 'threeFile/glb/glb-26.glb',
		scale: .02,
		icon: require('@/assets/model-icon/16.png')
	},
	{
		name: '龙',
		key: 'dragon',
		fileType: 'glb',
		map: require('@/assets/maps/4.png'),
		id: 29,
		animation: true,
		scale: 1,
		position: {
			x: 0,
			y: -1,
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
for (let i = 0; i <= 15; i++) {
	const image = {
		id: i,
		url: require(`@/assets/image/view-${i + 1}.png`),
		file: `threeFile/hdr/${i + 1}.hdr`
	}
	viewImageList.push(image)
}

const mapImageList = [
	{
		id: 100,
		url: require(`@/assets/maps/5.jpg`)
	},
	{
		id: 99,
		url: require(`@/assets/maps/6.jpg`)
	},
	{
		id: 98,
		url: require(`@/assets/maps/7.jpg`)
	},
	{
		id: 97,
		url: require(`@/assets/maps/8.jpg`)
	},
	{
		id: 96,
		url: require(`@/assets/maps/9.jpg`)
	},
	{
		id: 95,
		url: require(`@/assets/maps/10.jpg`)
	},
	{
		id: 94,
		url: require(`@/assets/maps/11.png`)
	},
	{
		id: 93,
		url: require(`@/assets/maps/12.jpg`)
	},
	{
		id: 92,
		url: require(`@/assets/maps/13.jpg`)
	},
	{
		id: 91,
		url: require(`@/assets/maps/14.png`)
	},
	{
		id: 90,
		url: require(`@/assets/maps/16.jpg`)
	},
	{
		id: 89,
		url: require(`@/assets/maps/17.jpg`)
	},
	{
		id: 88,
		url: require(`@/assets/maps/18.jpg`)
	},
	{
		id: 87,
		url: require(`@/assets/maps/19.jpg`)
	},
	...viewImageList
]

// 几何体模型列表
const geometryModelList = [
	{
		id: 30,
		name: '立方缓冲几何体',
		modelType: 'geometry',
		type: 'BoxGeometry',
		width: 1, // X轴上面的宽度
		height: 1, // Y轴上面的高度
		depth: 1, // 轴上面的深度
		widthSegments: 1, //宽度的分段数
		heightSegments: 1, //高度的分段数
		depthSegments: 1, //深度的分段数
	},
	{
		id: 31,
		name: '胶囊几何体',
		modelType: 'geometry',
		type: 'CapsuleGeometry',
		radius: .5, // 胶囊半径
		length: .5, //中间区域的长度
		capSegments: 10, // 构造盖子的曲线部分的个数 
		radialSegments: 20, //覆盖胶囊圆周的分离的面的个数
	},
	{
		id: 32,
		name: '圆形缓冲几何体',
		modelType: 'geometry',
		type: 'CircleGeometry',
		radius: .5, // 半径
		segments: 32, //分段（三角面）的数量
		thetaStart: 0, // 第一个分段的起始角度 
		thetaLength: 6.283185307179586, //圆形扇区的中心角
	},
	{
		id: 33,
		name: '圆锥缓冲几何体',
		modelType: 'geometry',
		type: 'ConeGeometry',
		radius: .5, // 半径
		height: 1, //圆锥的高度
		radialSegments: 8, // 圆锥侧面周围的分段数 
		heightSegments: 1, //圆形扇区的中心角
		openEnded: false, //指明该圆锥的底面是开放的还是封顶的
		thetaStart: 0,
		thetaLength: 6.283185307179586, //圆形扇区的中心角
	},
	{
		id: 34,
		name: '圆锥缓冲几何体',
		modelType: 'geometry',
		type: 'CylinderGeometry',
		radiusTop: .5,
		radiusBottom: .5,
		height: 1,
		radialSegments: 8,
		heightSegments: 1,
		openEnded: false,
		thetaStart: 0,
		thetaLength: 6.283185307179586, //圆形扇区的中心角
	},
	{
		id: 35,
		name: '十二面缓冲几何体',
		modelType: 'geometry',
		type: 'DodecahedronGeometry',
		radius: .5,
		detail: 0,
	},
	{
		id: 36,
		name: '二十面缓冲几何体',
		modelType: 'geometry',
		type: 'IcosahedronGeometry',
		radius: .5,
		detail: 0,
	},
	{
		id: 37,
		name: '八面缓冲几何体',
		modelType: 'geometry',
		type: 'OctahedronGeometry',
		radius: .5,
		detail: 0,
	},
	{
		id: 38,
		name: '平面缓冲几何体',
		modelType: 'geometry',
		type: 'PlaneGeometry',
		width: 1, // X轴上面的宽度
		height: 1, // Y轴上面的高度
		widthSegments: 1, //宽度的分段数
		heightSegments: 1, //高度的分段数
	},
	{
		id: 39,
		name: '圆环缓冲几何体',
		modelType: 'geometry',
		type: 'RingGeometry',
		innerRadius: .5,
		outerRadius: 1,
		thetaSegments: 8,
		phiSegments: 1,
		thetaStart: 0,
		thetaLength: 6.283185307179586,
	},
	{
		id: 40,
		name: '球缓冲几何体',
		modelType: 'geometry',
		type: 'SphereGeometry',
		radius: .5,
		widthSegments: 32,
		heightSegments: 16,
		phiStart: 0,
		phiLength: 6.283185307179586,
		thetaStart: 0,
		thetaLength: 3.141592653589793,
	},
	{
		id: 41,
		name: '四面缓冲几何体',
		modelType: 'geometry',
		type: 'TetrahedronGeometry',
		radius: .5,
		detail: 0,
	},
	{
		id: 42,
		name: '圆环缓冲几何体',
		modelType: 'geometry',
		type: 'TorusGeometry',
		radius: .5,
		tube: .1,
		radialSegments: 15,
		tubularSegments: 15,
		arc: 6.283185307179586,
	},
	{
		id: 43,
		name: '圆环缓冲扭结几何体',
		modelType: 'geometry',
		type: 'TorusKnotGeometry',
		radius: .5,
		tube: .1,
		tubularSegments: 25,
		radialSegments: 8,
		P: 2,
		q: 3,
	},
]

export { modelList, backgrundList, viewImageList, mapImageList, geometryModelList }