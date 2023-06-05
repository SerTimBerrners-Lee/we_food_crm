<template>
	<add-promo />

  <a-table :columns="columns" :data-source="getPromo" @change="onChange">
		
    <template #headerCell="{ column }">
			<template v-if="column.key === 'id'">
        <span>
          ID
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'max_date_actions'">
          {{ new Date(record.max_date_actions).toLocaleDateString('ru-RU') }}
      </template>

      <template v-if="column.key === 'action'">
        <span>
          <edit-promo :promo="record" />
          <a-divider type="vertical" />
          
					<a-popconfirm
						title="Вы точно хотите удалить?"
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
import AddPromo from '@/components/Promo/AddPromo';
import EditPromo from '@/components/Promo/EditPromo';

const columns = [
	{
		id: 'ID',
		dataIndex: 'id',
		key: 'id',
	},
  {
		title: 'Название',
		key: 'name',
		dataIndex: 'name',
	},
  {
		title: 'Описание',
		key: 'description',
		dataIndex: 'description',
	},
	{
		title: 'Время действия',
		key: 'max_date_actions',
		dataIndex: 'max_date_actions',
	},
	{
		title: 'Действие',
		key: 'action',
  }
];

export default defineComponent({
  components: {
    AddPromo,
    EditPromo,
  },
  computed: mapGetters(['getPromo']),
  setup() {
    const store = useStore();

    store.dispatch('getAllPromo').then(res => {
      if (!res.success)
        message.error(res?.error || "Произошла ошибка при получении данных");
    });

		const confirm = async (promo_id) => {
      console.log(promo_id)
    }

    return {
      columns,
			confirm,
    };
  },
});
</script>