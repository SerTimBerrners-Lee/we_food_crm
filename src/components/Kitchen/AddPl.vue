<template>
  <a-button type="primary" @click="showDrawer">
    <template #icon><PlusOutlined /></template>
    Добавить меню
  </a-button>
  <a-drawer
    title="Добавить продуктовую линейку"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
	<i>*если вы выбирете статус Актуально - меню отобразится на лендинге, сразу после сохранения </i>
    <a-form
      :model="form"
      :rules="rules"
      layout="vertical"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Название" name="line_name">
            <a-input v-model:value="form.line_name" placeholder="Введите название" />
          </a-form-item>
        </a-col>
      </a-row>

			<a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Минимум блюд" name="count_dishes_min">
            <a-input type="number" v-model:value="form.count_dishes_min" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Максимум блюд" name="count_dishes_max">
            <a-input type="number" v-model:value="form.count_dishes_max" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
				<a-col :span="12">
         <a-form-item label="Стоимость 1 блюда" name="price_one_dishes">
            <a-input type="number" v-model:value="form.price_one_dishes" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="Статус" name="status">
            <a-select v-model:value="form.status" placeholder="Выберите статус">
              <a-select-option value="revelant">Актуально</a-select-option>
              <a-select-option value="not_revelant">Не актуально</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
				<a-col :span="12">
         <a-form-item label="Другие рассходы" name="other_expenses">
            <a-input type="number" v-model:value="form.other_expenses" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
				<i>*Скидка вносится форматом день/день/%скидки: Например 3/5/1 = c 3 по 5 день скидка = 1%</i>
				<i>*Чтобы выбрать любое число можно написать так: 30/0/11. Эта запись будет означать от 30 и до любого числа</i>
        <a-col :span="4">
          <a-form-item label="Скидки">
						<div v-for="(item, index) of state.precent_range_discont || []" :key="index">
							#{{ index+1 }}<input :value="item || 'etet'" :placeholder='`3/5/1`' @input="e => formatMask(e, index)" />
						</div>
          </a-form-item>
        </a-col>
      </a-row>

			<a-button  @click="addDiscont">
				<template #icon><PlusOutlined /></template>
			</a-button>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Описание" name="description">
            <a-textarea
              v-model:value="form.description"
              :rows="4"
              placeholder="Любое дополнение или заметку"
            />
          </a-form-item>
        </a-col>
      </a-row>

     <a-form-item>
       <a-space>
        <a-button @click="onClose">Отменить</a-button>
        <a-button type="primary" html-type="submit" v-if="!state.loading">Сохранить</a-button>
        <LoaderSpin v-else />
      </a-space>
     </a-form-item>
    </a-form>

  </a-drawer>
</template>
<script>

import { useStore } from 'vuex';
import { message } from 'ant-design-vue';
import LoaderSpin from '@/components/LoaderSpin';
import { PlusOutlined } from '@ant-design/icons-vue';
import { defineComponent, reactive, ref } from 'vue';
import { toLocaleDatePicter } from '@/js/date.methods';

export default defineComponent({
  components: {
    PlusOutlined,
    LoaderSpin
  },
  setup() {
    const store = useStore();

    const state = reactive({
      loading: false,
      precent_range_discont: []
    });

    const form = reactive({
      line_name: '',
      count_dishes_min: 3,
      count_dishes_max: 3,
      price_one_dishes: 0,
      precent_range_discont: '',
			status: 'Не актуально',
			description: '',
      other_expenses: 1000,
    });

    const rules = {
      line_name: [{
        required: true,
        message: 'Введите название',
      }],
    };
    const visible = ref(false);
    const showDrawer = () => {
      visible.value = true;
    };
    const onClose = () => {
      visible.value = false;
    };
    const onSave = async (formaingData) => {
      state.loading = true;
      const result = await store.dispatch('createProductLine', formaingData);
      state.loading = false;
      
      if (result.success)
        message.success("Продуктовая линия успешно добавлена");
      else {
        const msg = result?.error || "Произошла ошибка при добавлении продуктовой линии";
        message.error(msg);
      }

      return onClose();
    };
    const onFinish = (finish) => {
      const data = JSON.stringify({
        ...finish,
        precent_range_discont: state.precent_range_discont
      });

      onSave(data); 
    }
    const onFinishFailed = ({ errorFields }) => {
      console.log("errorFields: ", errorFields);
      return message.error("Были допушены ошибки при заполнении");
    }

    const customFormat = (value) => {
      return toLocaleDatePicter(value)
    }

		const formatMask = (e, inx) => {
			const val = e.target?.value;
			let value = val.replace(/[^0-9/]/g, '');
			const parts = value.split('/');
			value = parts.join('/');

			state.precent_range_discont[inx] = value;

			if (!val) {
				state.precent_range_discont = state.precent_range_discont.filter((el, index) => 
					index != inx
				);
			}
		}

		const addDiscont = () => {
			state.precent_range_discont.push('0/0/0');
		}

    return {
      form,
      rules,
      visible,
      showDrawer,
      onClose,
      onSave,
      onFinish,
      onFinishFailed,
      customFormat,
      state,


			formatMask,
			addDiscont
    };
  },
});
</script>