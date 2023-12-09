<template>
	<router-view v-slot="{ Component, route }" :include="['modelEdit']">
		<keep-alive>
			<component v-if="route.meta.keepAlive" :is="Component" />
		</keep-alive>
		<component v-if="!route.meta.keepAlive" :is="Component" />
	</router-view>
</template>




