<template>
	<add-user />

  <a-table :columns="columns" :data-source="getUsers" @change="onChange">
		
    <template #headerCell="{ column }">
			<template v-if="column.key === 'id'">
        <span>
          ID
        </span>
      </template>
      <template v-if="column.key === 'name'">
        <span>
          Имя
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a>
          {{ record.name }}
        </a>
      </template>

      <template v-else-if="column.key === 'role'">
        <span>
          <a-tag
            :color="record.role == 'user' ? 'green' : 'geekblue'"
          >
            {{ record.role.toUpperCase() }}
          </a-tag>
        </span>
      </template>

      <template v-else-if="column.key === 'action'">
        <span>
          <user-order :user_id="record.id" />
          <a-divider type="vertical" />
					<a-popconfirm
						title="Вы точно хотите вернуть пользователя?"
						ok-text="Да"
						cancel-text="Нет"
						@confirm="confirm(record.id)"
					>
						<a href="#" style="color: red">Восстановить</a>
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
import AddUser from '@/components/Users/AddUser';
import UserOrder from '@/components/Order/UserOrder';

const columns = [
	{
		id: 'ID',
		dataIndex: 'id',
		key: 'id',
	},
	{
		name: 'Имя Фамилия',
		dataIndex: 'name',
		key: 'name',
	}, {
		title: 'Адресс',
		dataIndex: 'address',
		key: 'address',
	}, {
		title: 'Телефон',
		key: 'phone',
		dataIndex: 'phone',
	},
	{
		title: 'Роль',
		key: 'role',
		dataIndex: 'role',
		sorter: {
			compare: (a, b) => a.chinese - b.chinese,
			multiple: 3,
		},
	},
	{
		title: 'Действие',
		key: 'action',
	}];

export default defineComponent({
  components: {
    AddUser,
    UserOrder
  },
  computed: mapGetters(['getUsers']),
  setup() {
    const store = useStore();

    store.dispatch('getAllBannedUser', { page: 1, limit: 25 }).then(res => {
      if (!res.success)
        message.error(res?.error || "Произошла ошибка при получении данных");
    });

		const confirm = async (user_id) => {
      if (!user_id) return message.warn("Не правильно переданы параметры для восстановления пользователя");
      const result = await store.dispatch("deleteUser", user_id);
      if (result.success) 
        return message.success('Пользователь восстановлен');
      
      message.error(result?.error || "Не удалось восстановить пользователя");
    };

    return {
      columns,
			confirm,
    };
  },
});
</script>