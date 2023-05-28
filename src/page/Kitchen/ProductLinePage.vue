<template>
	<add-pl />
	<div style="background: #ececec; padding: 30px" class="container_instruction">
		<a-card v-for="pl of getProductsLine" :key="pl" :title="pl.line_name" :bordered="false" style="width: 40%">
			<template #extra><edit-pl :pl_id="pl.id" /></template>
			<p>
				<strong>Кол-во блюд:</strong> 
				от <a-tag><strong>{{pl.count_dishes_min}}</strong></a-tag>
				до <a-tag><strong>{{pl.count_dishes_max}}</strong></a-tag>
			</p>
			<p>
				<strong>Стоимость 1 блюда:</strong>
				<a-tag>{{pl.price_one_dishes}}</a-tag>
			</p>
			<p>
				<strong>Статус:</strong>
				<a-tag :color="pl.status === 'revelant' ? 'green' : 'orange'">{{pl.status === 'revelant' ? 'Актуально' : 'Не актуально'}}</a-tag>
			</p>
			<p>
				<strong>Скидки:</strong>
				<a-tag v-for="item of parseDiscontList(pl.precent_range_discont)" :key="item">
					{{item.discount}}
				</a-tag>
			</p>

			<strong>Описание: </strong>
			<a-card>{{ pl.description }}</a-card>

		</a-card>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AddPl from '@/components/Kitchen/AddPl';
import EditPl from '@/components/Kitchen/EditPl';

export default {
	components: { AddPl, EditPl },
	computed: mapGetters(['getProductsLine']),
	methods: {
		...mapActions(['getAllProductLine']),
		parseDiscontList(list) {
			try {
				return list ? JSON.parse(list) : [];
			} catch (e) {
				console.error(e);
				return [];
			}
		}
	},
	async mounted() {
		await this.getAllProductLine({ page: 1, limit: 25 });
	}
}
</script>

<style scoped>
.container_instruction {
	display: flex;
	flex-wrap: wrap;
}
.container_instruction>.ant-card {
	margin: 10px;
	width: 400px !important;
}
</style>