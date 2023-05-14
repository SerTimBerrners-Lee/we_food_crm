<template>

	<add-dishes />

	<div style="background: #ececec; padding: 30px" class="container_instruction">
		<a-card v-for="dishes of getDishes" :key="dishes" :title="dishes.name" :bordered="false" style="width: 40%">
			<template #extra><edit-dishes :dishes_id="dishes.id" /></template>
			<p v-if="dishes.type">
				<strong>Тип Блюда:</strong>
				<a-tag v-for="tp of dishes.type" :key="tp">{{ tp }}</a-tag>
			</p>

			<a-row :gutter="16">
        <a-col :span="12">
          <strong>Ккал:</strong> <span>{{ dishes.calories }}</span>
        </a-col>
				<a-col :span="12">
					<strong>Белки:</strong> <span>{{ dishes.proteins }}</span>
				</a-col>
      </a-row>
			<a-row :gutter="16">
        <a-col :span="12">
					<strong>Углеводы:</strong> <span>{{ dishes.carbohydrates }}</span>
        </a-col>
				<a-col :span="12">
					<strong>Жиры:</strong> <span>{{ dishes.fast }}</span>
				</a-col>
      </a-row>

			<strong>Описание: </strong>
			<a-card>{{ dishes.description }}</a-card>

		</a-card>
	</div>
</template>
<script>
import { defineComponent } from 'vue';
import { message } from 'ant-design-vue';
import { mapGetters, useStore } from 'vuex';
import AddDishes from '@/components/Kitchen/Dishes/AddDishes';
import EditDishes from '@/components/Kitchen/Dishes/EditDishes';

export default defineComponent({
  components: {
		AddDishes,
		EditDishes
  },
  computed: mapGetters(['getDishes']),
  setup() {
    const store = useStore();

    store.dispatch('getAllDishes', { page: 1, limit: 25 }).then(res => {
      if (!res.success)
        message.error(res?.error || "Произошла ошибка при получении данных");
    });

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

    return {
      formatDateRange,
			confirm,
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