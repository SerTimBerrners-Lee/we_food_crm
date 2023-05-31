<template>
  <a @click="showDrawer">
    {{ title ? title : 'Изменить' }} 
  </a>
  <a-drawer
    title="Управлением заказом"
    :width="720"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <a-form
      :model="form"
      :rules="rules"
      layout="vertical"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-row :gutter="16">
        <a-col :span="16">
          <a-form-item label="Даты доставок" name="date_range">
            <a-range-picker
              v-model:value="form.date_range"
              style="width: 100%"
              :format="dateFormat"
              :get-popup-container="trigger => trigger.parentElement"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
         <a-form-item label="Адресс" name="address">
            <a-input v-model:value="form.address" placeholder="Адресс" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="Статус оплаты" name="payment_state">
            <a-select v-model:value="form.payment_state" placeholder="Выберите роль">
              <a-select-option value="paid">Оплечено</a-select-option>
              <a-select-option value="not_paid">Не оплачено</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Метод оплаты" name="payment_method">
            <a-select v-model:value="form.payment_method" placeholder="Выберите роль">
              <a-select-option value="cash">Наличными</a-select-option>
              <a-select-option value="card">Картой</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="Процесс подтверждения" name="processing">
            <a-select v-model:value="form.processing" placeholder="Выберите роль">
              <a-select-option value="confirmed">Подтвержден</a-select-option>
              <a-select-option value="not_confirmed">Не подтвержден</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

      </a-row>

      <a-row :gutter="16">

        <a-col :span="12">
          <a-form-item label="Время" name="time">
            <a-select v-model:value="form.time" placeholder="Выберите роль">
              <a-select-option v-for="time of state.times" :key="time" :value="time">{{ time }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

      </a-row>

      <a-row :gutter="16" style="margin-top: 10px; margin-bottom: 10px;">
        <a-col :span="12">
          <a-form-item label="Пользователь" name="user_id">
            <modal-base-users @user-selected="onUserSelected" />
            <h3 v-if="form?.user">Выбранный пользователь: <a> {{ (form.user?.name || '...') + ' ' + (form.user?.surname || '...') }} </a></h3>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16" style="margin-top: 10px; margin-bottom: 10px;">
        <a-col :span="12">
          <a-form-item label="Продуктовая линейка" name="product_line_id">
            <modal-base-pl @pl-selected="onPlSelected" />
            <h3 v-if="form?.product_line">Продуктовая линейка: <a> {{ form.product_line?.line_name }} </a></h3>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item label="Кол-во блюд в день" name="dishes_kolvo">
            <a-select v-model:value="form.dishes_kolvo" placeholder="Выберите роль">
              <a-select-option v-for="item of state.dishes_pl" :key="item" :item="item" :value="item">{{ item }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">

        <a-col :span="12">
          <a-form-item label="Кол-во дней доставки делится на:" name="devide_by">
            <a-input-number v-model:value="form.devide_by" :min="1" />
          </a-form-item>
        </a-col>

      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="Описание" name="description">
            <a-textarea
              v-model:value="form.description"
              :rows="4"
              placeholder="Любое дополнение или заметка"
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

import dayjs from 'dayjs';
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';
import ModalBasePl from '../Kitchen/ModalBasePl';
import LoaderSpin from '@/components/LoaderSpin';
import { defineComponent, reactive, ref } from 'vue';
import ModalBaseUsers from '../Users/ModalBaseUsers';
import { toLocaleDatePicter } from '@/js/date.methods';

export default defineComponent({
  components: {
    LoaderSpin,
    ModalBaseUsers,
    ModalBasePl
  },
  props: {
    order_id: String,
    title: String
  },
  setup(props, { emit }) {
   
    const store = useStore();

    const state = reactive({
      loading: false,
      dishes_pl: [],
      times: [
        '07:00',
        '07:30',
        '08:00',
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
      ]
    });

    const form = reactive({
      date_range: null,
      address: '',
      payment_state: 'not_paid',
      payment_method: '',
      processing: 'not_confirmed',
      user: null,
      product_line: null,
      devide_by: 2,
      dishes_kolvo: 0,
      time: '07:00',

      description: '',
    });
    const rules = {
      address: [{
        required: true,
        message: 'Введите Адресс',
      }],
      payment_state: [{
        required: true,
        message: 'Введите Статус оплаты',
      }],
      payment_method: [{
        required: true,
        message: 'Введите Метод оплаты',
      }],
      processing: [{
        required: true,
        message: 'Введите Процесс работы над заказом',
      }],
      user: [{
        required: true,
        message: 'Выберите пользователя',
      }],
      dishes_kolvo: [{
        required: true,
        message: 'Выберите кол-во блюд',
      }],
      devide_by: [{
        required: false,
      }],
      description: [{
        required: false,
        message: 'Please enter url description',
      }],
    };
    const visible = ref(false);

    const showDrawer = async() => {
      const result = await store.dispatch('getOneOrder', props.order_id);
      if (!result.success) {
        onClose();
        return message.error(result.error || "Произошла ошибка");
      }

      const { data } = result;
      form.address = data.address;
      form.description = data.description;
      form.payment_method = data.payment_method;
      form.payment_state = data.payment_state;
      form.processing = data.processing;
      form.devide_by = data.devide_by;
      form.time = data.time;
      form.dishes_kolvo = data.dishes_kolvo;

      if (data.date_range) {
        const splt = data.date_range.split('|');
        form.date_range = ref([dayjs(splt[0], dateFormat), dayjs(splt[1], dateFormat)]);
      }

      if (data?.user) form.user = data.user;
      if (data?.product_line) {
        form.product_line = data.product_line;
        // Полуаем кол-во блюд
        const { count_dishes_max, count_dishes_min } = form.product_line;
        if (count_dishes_max <= count_dishes_min) state.dishes_pl = [count_dishes_min];
        else
          state.dishes_pl = [...Array((count_dishes_max+1)-count_dishes_min)].map((_, inx) => count_dishes_min+inx);
      }

      visible.value = true;
    };
    const onClose = () => {
      visible.value = false;
    };
    const onSave = async (formaingData) => {
      state.loading = true;
      const result = await store.dispatch('updateOrder', formaingData);
      state.loading = false;
      
      if (result.success) {
        message.success("Успешно обновлено");
        emit('unmount', {
          id: props.order_id,
          processing: form.processing
        });
      } else {
        const msg = result?.error || "Произошла ошибка при обновлении";
        message.error(msg);
      }

      return onClose();
    };
    const onFinish = (finish) => {
      let date_range = null;
      if (finish.date_range) {
        const dat1 = customFormat(finish.date_range[0]); 
        const dat2 = customFormat(finish.date_range[1]); 
        date_range = dat1+'|'+dat2;
      }
      
      const data = JSON.stringify({
        ...finish,
        date_range: date_range,
        user_id: form.user?.id,
        product_line_id: form.product_line?.id,
        id: props.order_id
      });

      onSave(data);
    }
    const onFinishFailed = () => {
      return message.error("Были допушены ошибки при заполнении");
    }

    const customFormat = (value) => toLocaleDatePicter(value);

    const onUserSelected = (selectedUser) => {
      if (selectedUser) form.user = selectedUser;
    }

    const onPlSelected = (selectedPl) => {
      if (selectedPl) form.product_line = selectedPl;
    }

    const dateFormat = 'DD.MM.YYYY';

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
      dateFormat,
      onUserSelected,
      onPlSelected
    };
  },
});
</script>