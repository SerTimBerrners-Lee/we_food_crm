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
          Имя и Фамилия
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a>
          {{ record.name }} {{ record.surname }}
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

      <template v-else-if="column.key === 'address'">
        <span>
          {{ record.address }}
        </span>
      </template>

      <template v-else-if="column.key === 'action'">
        <span>
          <edit-user :user_id="record.id" @unmount="unmount_edit_user" />
          <a-divider type="vertical" />

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
import AddUser from '@/components/Users/AddUser';
import EditUser from '@/components/Users/EditUser';

const columns = [
	{
		id: 'ID',
		dataIndex: 'id',
		key: 'id',
	},
	{
		name: 'Имя и Фамилия',
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
    EditUser
  },
  computed: mapGetters(['getUsers']),
  setup() {
    const store = useStore();

    store.dispatch('getNotConfirmedUsers', { page: 1, limit: 25 }).then(res => {
      if (!res.success)
        message.error(res?.error || "Произошла ошибка при получении данных");
    });

		const confirm = async (user_id) => {
      if (!user_id) return message.warn("Не правильно переданы параметры для удаления пользователя");
      const result = await store.dispatch("deleteUser", user_id);
      if (result.success) 
        return message.success('Пользователь удален');
      
      message.error(result?.error || "Не удалось удалить пользователя");
    };

    const unmount_edit_user = (user) => {
      if (!user) return false;

      const { id, status } = user;
      if (status == 'confirmed') store.commit("delete_user", id);
    }

    return {
      columns,
      unmount_edit_user,
			confirm,
    };
  },
});
</script>