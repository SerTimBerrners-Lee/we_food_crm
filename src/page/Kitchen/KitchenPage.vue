<template>
	<div style="background: #ececec; padding: 30px" class="container_instruction">
		<a-button v-if="!loading" @click="updateStages">Обновить заказы на завтра</a-button>
		<LoaderSpin v-else />
	</div>

	<div style="background: #ececec; padding: 30px" class="container_instruction">
		<a-card v-for="stage of getStages" :key="stage.id" :title="'#' + stage.id" :bordered="false" style="width: 40%">
			<template #extra>
				<a-button v-if="!loading" type="primary" @click="toDelivery(stage.id)">Передать в доставку</a-button>
				<LoaderSpin v-else />
			</template>

			<p>
				<strong>Блюда: </strong>
			</p>

			<p v-if="stage?.user">
				<strong>Пользователь: </strong>
				<edit-user :user_id="stage.user.id" :title="stage?.user?.name + ' ' + stage?.user?.surname" />
			</p>

			<p v-if="stage?.order">
				<strong>Номер заказа: </strong>
				<edit-order :order_id="stage.order.id" :title="'Просмотр'" />
			</p>

			<strong>Описание: </strong>
			<a-card>{{ stage.description }}</a-card>

		</a-card>
	</div>
</template>
<script>
import { message } from 'ant-design-vue';
import { mapGetters, useStore } from 'vuex';
import { defineComponent, reactive } from 'vue';
import EditUser from '@/components/Users/EditUser';
import EditOrder from '@/components/Order/EditOrder';

export default defineComponent({
  components: {
		EditUser,
		EditOrder
  },
  computed: mapGetters(['getStages']),
  setup() {
    const store = useStore();

		const state = reactive({
      loading: false,
    });

    const reloadStages = async () => {
			const res = await store.dispatch('getStages', { page: 1, limit: 25, status: 0 });
			if (!res.success)
				message.error(res?.error || "Произошла ошибка при получении данных");
		}

		reloadStages();

		const confirm = async (dishes_id) => {
      if (!dishes_id) return message.warn("Не правильно переданы параметры для удаления");
      const result = await store.dispatch("deleteDishes", dishes_id);
      if (result.success) 
        return message.success('Удалено');
      
      message.error(result?.error || "Не удалось удалить");
    };

    const formatDateRange = (data) => {
      if (!data) return '';
      const splt = data.split("|");
      return `C <strong>${splt[0]}</strong> по <strong>${splt[1]}</strong>`;
    }

		const updateStages = async () => {
			state.loading = true;
			const result = await store.dispatch("formNewStageToday");
			state.loading = false;

			if (result?.success) {
				message.success(result?.data?.message);
				await reloadStages();
			}
			else message.error(result.error || 'Произошла ошибка при получении заказов на завтра');
		}

		const toDelivery = async (id) => {
			state.loading = true;
			const result = await store.dispatch("fetchToDelivery", id);
			state.loading = false;

			if (!result.success) return message.error(result.error || 'Произошла ошибка');
			return message.success("Удачно передано");
		}

    return {
      formatDateRange,
			confirm,
			updateStages,
			toDelivery
    };
  },
});
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