<template>
	<a-button type="primary" @click="showDrawer">
    <template #icon></template>
    Выбрать Продуктовую линейку
  </a-button>
  <a-drawer
    title="Выбрать Продуктовую линейку"
    :width="720"
    :visible="visibleModalBasePl"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
		<add-pl />
		<a-input-search
			v-model:value="searchPlData"
			placeholder="Поиск по названию"
			style="width: 100%; margin-top: 40px;"
			@search="onSearch"
		/>
		<div style="background: #ececec; padding: 30px" class="container_instruction">
			<a-card v-for="pl of getProductsLine" :key="pl" :title="pl.line_name" :bordered="false" style="width: 40%">
				<template #extra>
					<a-button type="primary" @click="returnPl(pl)">Выбрать</a-button>
				</template>
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
					<a-tag v-for="discont of parseDiscontList(pl.precent_range_discont)" :key="discont">
						{{discont}}
					</a-tag>
				</p>

				<strong>Описание: </strong>
				<a-card>{{ pl.description }}</a-card>

			</a-card>
		</div>

	</a-drawer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AddPl from '@/components/Kitchen/AddPl';

export default {
	components: { AddPl },
	computed: mapGetters(['getProductsLine']),
	data() {
		return {
			visibleModalBasePl: false,
			searchPlData: '',
		}
	},
	methods: {
		...mapActions(['getAllProductLine']),
		parseDiscontList(list) {
			try {
				return list ? JSON.parse(list) : [];
			} catch (e) {
				console.error(e);
				return [];
			}
		},
		returnPl(pl) {
			this.onClose();
			return this.$emit('pl-selected', pl);
		},
		showDrawer() {
			this.visibleModalBasePl = true;
		},
		onClose() {
			this.visibleModalBasePl = false;
		},
		onSearch(val) {
			console.log(val);
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