<template>
 <a-button type="primary" @click="showDrawer">
    <template #icon></template>
    Выбрать пользователя
  </a-button>
  <a-drawer
    title="Выбрать пользователя"
    :width="720"
    :visible="visibleModalBaseUsers"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
		<add-user />

		<br />
		<a-input-search
			v-model:value="searchUserData"
			placeholder="Поиск по имени или телефону"
			style="width: 100%; margin-top: 40px;"
			@search="onSearch"
		/>
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

				<template v-else-if="column.key === 'action'">
					<span>
						<a @click="returnUser(record)">Выбрать</a>
						<a-divider type="vertical" />

						<a>Заказы</a>
						<a-divider type="vertical" />
					</span>
				</template>

			</template>
		</a-table>

	</a-drawer>
</template>
<script>
import { message } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
import { mapGetters, useStore } from 'vuex';
import AddUser from '@/components/Users/AddUser';

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
		title: 'Телефон',
		key: 'phone',
		dataIndex: 'phone',
	},
	{
		title: 'Действие',
		key: 'action',
	}];

export default defineComponent({
  components: {
    AddUser,
  },
  computed: mapGetters(['getUsers']),
  setup(props, { emit }) {
    const store = useStore();
		const searchUserData = ref('');

    store.dispatch('getAllUsers', { page: 1, limit: 25 }).then(res => {
      if (!res.success)
        message.error(res?.error || "Произошла ошибка при получении данных");
    });

		const visibleModalBaseUsers = ref(false);
    const showDrawer = () => {
      visibleModalBaseUsers.value = true;
    };
		const onClose = () => {
      visibleModalBaseUsers.value = false;
    };

		const returnUser = (user) => {
			emit('user-selected', user);
			onClose();
		}

		const onSearch = (value) => {
			console.log(value);
		}

    return {
      columns,
			visibleModalBaseUsers,
			showDrawer,
			onClose,
			returnUser,
			onSearch,
			searchUserData
    };
  },
});
</script>