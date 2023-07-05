

const modelList = [
	{
		name: '机器人1',
		id: 1,
		type: 'glb',
		filePath: 'threeFile/glb/glb-1.glb',
		icon: require('@/assets/image/mode-icon-1.png')
	},
	{
		name: '人物1',
		id: 2,
		type: 'glb',
		filePath: 'threeFile/glb/glb-2.glb',
		icon: require('@/assets/image/mode-icon-1.png')
	},
	{
		name: '人物2',
		id: 3,
		type: 'glb',
		filePath: 'threeFile/glb/glb-3.glb',
		icon: require('@/assets/image/mode-icon-1.png')
	},
	{
		name: '汽车1',
		id: 5,
		type: 'glb',
		filePath: 'threeFile/glb/glb-4.glb',
		icon: require('@/assets/image/mode-icon-1.png')
	},
	{
		name: '人物3',
		id: 6,
		type: 'glb',
		filePath: 'threeFile/glb/glb-5.glb',
		icon: require('@/assets/image/mode-icon-1.png')
	},
	{
		name: '机器人2',
		id: 7,
		type: 'glb',
		filePath: 'threeFile/glb/glb-6.glb',
		icon: require('@/assets/image/mode-icon-1.png')
	},
	{
		name: 'fbx',
		id: 4,
		type: 'fbx',
		filePath: 'threeFile/fbx/robot-1.fbx',
		icon: require('@/assets/image/mode-icon-1.png')
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
		url: require('@/assets/image/model-bg-5.jpg')
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
]

let viewImageList = []
for (let i = 0; i <= 10; i++) {
	const image = {
		id: i,
		url: require(`@/assets/image/view-${i + 1}.png`)
	}
	viewImageList.push(image)
}


//环境光贴图
const ambientLightList = [
	{
		name: '餐厅',
		id:1,
		url: 'threeFile/hdr/hdr-1.hdr',
		icon:require('@/assets/image/light-1.png')
	},
	{
		name: '黑暗空间',
		id:2,
		url: 'threeFile/hdr/hdr-2.hdr',
		icon:require('@/assets/image/light-2.png')
	},
	{
		name: '荒漠',
		id:3,
		url: 'threeFile/hdr/hdr-3.hdr',
		icon:require('@/assets/image/light-3.png')
	},
	{
		name: '夜晚',
		id:4,
		url: 'threeFile/hdr/hdr-4.hdr',
		icon:require('@/assets/image/light-4.png')
	},
	{
		name: '剧院',
		id:5,
		url: 'threeFile/hdr/hdr-5.hdr',
		icon:require('@/assets/image/light-5.png')
	},
	{
		name: '寒冬',
		id:7,
		url: 'threeFile/hdr/hdr-7.hdr',
		icon:require('@/assets/image/light-7.png')
	},
	{
		name: '办公厅',
		id:8,
		url: 'threeFile/hdr/hdr-8.hdr',
		icon:require('@/assets/image/light-8.png')
	},
]


export { modelList, backgrundList, viewImageList ,ambientLightList}