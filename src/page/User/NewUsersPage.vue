<template>
  <a-table :columns="columns" :data-source="data" @change="onChange">
		
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

      <template v-else-if="column.key === 'action'">
        <span>
					<edit-user :user_id="record.id" />
          <a-divider type="vertical" />

          <a>Заказы</a>
          <a-divider type="vertical" />

					<a-popconfirm
						title="Вы точно хотите удалить пользователя?"
						ok-text="Да"
						cancel-text="Нет"
						@confirm="confirm"
						@cancel="cancel"
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
import EditUser from '@/components/Users/EditUser.vue';

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
		title: 'Дата и Время регистрации',
		key: 'registration_date',
		dataIndex: 'registration_date',
	},
	{
		title: 'Действие',
		key: 'action',
	}];

const data = [{
  id: '1',
  name: 'John Brown',
  address: 'New York No. 1 Lake Park',
  phone: '+374 33156243',
  registration_date: '08.08.2023 13:88',
}, {
  id: '2',
  name: 'Jim Green',
  address: 'London No. 1 Lake Park',
  phone: '+374 33156243',
  registration_date: '08.08.2023 13:88',
}, {
  id: '3',
  address: 'Sidney No. 1 Lake Park',
  name: 'Joe Black',	
  phone: '+374 33156243',
  registration_date: '08.08.2023 13:88n',
}];
export default defineComponent({
  components: {
    EditUser
  },
  setup() {
		const confirm = (e) => {
      console.log(e);
      message.success('Click on Yes');
    };

    const cancel = (e) => {
      console.log(e);
      message.error('Click on No');
    };

    return {
      data,
      columns,

			confirm,
      cancel,
    };
  },
});
</script>