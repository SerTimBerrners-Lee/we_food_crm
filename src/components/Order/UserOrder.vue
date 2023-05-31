<template>
	<a type="primary" @click="showDrawer">
		Заказы
  </a>

	<a-drawer
    title="Заказы для пользователя"
    :width="1000"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
		<add-order />

		<a-table :columns="columns" :data-source="getOrdersUser" @change="onChange">
		
    <template #headerCell="{ column }">
			<template v-if="column.key === 'id'">
        <span>
          ID
        </span>
      </template>
      <template v-else-if="column.key === 'date_range'">
        <span>
          Даты доставки
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">

      <template v-if="column.key === 'date_range'">
        <span v-html="formatDateRange(record.date_range)">
        </span>
      </template>

      <template v-else-if="column.key === 'progress'">
        <span>
          <a-progress
            :percent="precentStage(record)"
            :steps="progressSteps(record?.date_range, record?.devide_by)"
          />
        </span>
      </template>

			<template v-else-if="column.key === 'processing'">
				<a-tag v-if="record.processing == 'not_confirmed'" color="red">Не подтвержден</a-tag>
				<a-tag v-else color="green">Подтвержден</a-tag>
      </template>

      <template v-else-if="column.key === 'action'">
        <span>
          <edit-order :order_id="record.id" />
          <a-divider type="vertical" />
          
					<a-popconfirm
						title="Вы точно хотите удалить Заказ?"
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
	
	</a-drawer>
</template>

<script>
import { message } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
import { mapGetters, useStore } from 'vuex';
import { getDaysDiff } from '@/js/date.methods';
import AddOrder from '@/components/Order/AddOrder';
import EditOrder from '@/components/Order/EditOrder';

const columns = [
	{
		id: 'ID',
		dataIndex: 'id',
		key: 'id',
	},
	{
		name: 'Даты доставки',
		dataIndex: 'date_range',
		key: 'date_range',
	}, {
		title: 'Адресс',
		dataIndex: 'address',
		key: 'address',
	},
  {
		title: 'Процесс выполнения',
		key: 'progress',
		dataIndex: 'progress',
	},
	{
		title: 'Статус подтверждения',
		key: 'processing',
		dataIndex: 'processing',
	},
	{
		title: 'Действие',
		key: 'action',
  }
];

export default defineComponent({
	props: {
		user_id: Number
	},
  components: {
    AddOrder,
    EditOrder,
  },
  computed: mapGetters(['getOrdersUser']),
  setup(props) {
    const store = useStore();

		const visible = ref(false);

		const confirm = async (order_id) => {
      if (!order_id) return message.warn("Не правильно переданы параметры для удаления");
      const result = await store.dispatch("deleteOrder", order_id);
      if (result.success) 
        return message.success('Удалено');
      
      message.error(result?.error || "Не удалось удалить");
    };

    const formatDateRange = (data) => {
      if (!data) return '';
      const splt = data.split("|");
      const is_delay = getDaysDiff(splt[1]) > 0;
      
      return `
        C <strong>${splt[0]}</strong>
        по <strong style='${is_delay ? "color: red;" : ""}'>${is_delay ? splt[1] + ' (Просрочено)' : splt[1]}</strong>`;
    }

    const progressSteps = (date_range, devide_by) => {
      if (!devide_by || !date_range) return 0;
      const [dat1, dat2] = date_range.split("|");
      if (!dat1 || !dat2) return 0;
      
      const days = getDaysDiff(dat1, dat2) + 1;
      const steeps = Math.ceil(days / devide_by);
      return steeps;
    }

    const precentStage = (order) => {
      if (!order?.stages) return 0;
      const { stages } = order;
      const steps = progressSteps(order.date_range, order.devide_by);

      let complited = 0;
      for (const item of stages) {
        if (item.status == 2) complited++;
      }

      const precent = ((complited / steps) * 100).toFixed(0);
      return precent;
    }

		const showDrawer = () => {
			visible.value = true;

			store.dispatch('fetchMyOrders', props.user_id).then(res => {
      if (!res.success)
        message.error(res?.error || "Произошла ошибка при получении данных");
			});
		}

		const onClose = () => {
			visible.value = false;
		}

    return {
      columns,
      formatDateRange,
			confirm,
      progressSteps,
      precentStage,
			showDrawer,
			onClose,
			visible
    };
  },
});
</script>