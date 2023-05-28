<template>

  <a-table :columns="columns" :data-source="getBids" @change="onChange">
		
    <template #headerCell="{ column }">
			<template v-if="column.key === 'id'">
        <span>
          ID
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'status'">
        <a-tag :color="'green'">{{ record.status }}</a-tag>
      </template>

      <template v-else-if="column.key === 'last_call'">
        <span>
          {{ record.last_call }}
        </span>
      </template>

			<template v-else-if="column.key === 'description'">
        <span>
          {{ record.description }}
        </span>
      </template>

      <template v-else-if="column.key === 'action'">
        <span>

          <a>Заказы</a>
          <a-divider type="vertical" />
          
					<a-popconfirm
						title="Вы точно хотите удалить пользователя?"
						ok-text="Да"
						cancel-text="Нет"
						@confirm="confirm(record.id)"
					>
						<a href="#" style="color: red">Удалить</a>
					</a-popconfirm>
        </span>
      </template>

    </template>
  </a-table>
</template>
<script>
import { defineComponent } from 'vue';
import { message } from 'ant-design-vue';
import { mapGetters, useStore } from 'vuex';

const columns = [
	{
		id: 'ID',
		dataIndex: 'id',
		key: 'id',
	},
	{
		title: 'Телефон',
		key: 'phone',
		dataIndex: 'phone',
	},
	{
		title: 'Статус',
		key: 'status',
		dataIndex: 'status',
	},
	{
		title: 'Последний звонок',
		key: 'last_call',
		dataIndex: 'last_call',
	},
	{
		title: 'Описание',
		key: 'description',
		dataIndex: 'description',
	},
	{
		title: 'Действие',
		key: 'action',
	}];

export default defineComponent({
  components: {
  },
  computed: mapGetters(['getBids']),
  setup() {
    const store = useStore();

    store.dispatch('getAllBids', { page: 1, limit: 25 }).then(res => {
      if (!res.success)
        message.error(res?.error || "Произошла ошибка при получении данных");
    });

		const confirm = async (user_id) => {
      if (!user_id) return message.warn("Не правильно переданы параметры для удаления пользователя");
      const result = await store.dispatch("deleteUser", 0);
      if (result.success) 
        return message.success('Пользователь удален');
      
      message.error(result?.error || "Не удалось удалить пользователя");
    };

    return {
      columns,

			confirm,
    };
  },
});
</script>