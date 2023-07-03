

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

export { modelList, backgrundList, viewImageList }