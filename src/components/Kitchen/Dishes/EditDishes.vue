<template>
  <a-button type="primary" @click="showDrawer">
  Изменить
  </a-button>
  <a-drawer
    title="Добавить Блюдо"
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
        <a-col :span="12">
          <a-form-item label="Название" name="name">
            <a-input v-model:value="form.name" placeholder="Введите название" />
          </a-form-item>
        </a-col>
      </a-row>

			<h2>Добавление/Изменение состава</h2>
			<a-row :gutter="16"  v-for="(item, index) of state.compound || []" :key="index">
        <a-col :span="12">
          <a-form-item label="Состав">#{{ index+1 }}
						<input :value="item.product" :placeholder='`Лук Репчатый`' @input="e => formatTitleCompound(e, index)" />
          </a-form-item>
        </a-col>
				<a-col :span="12">
          <a-form-item label="Описание">
						<textarea rows="4" :value="item.parametrs" :placeholder='`Описание`' @input="e => formatDescriptionCompound(e, index)" />
          </a-form-item>
        </a-col>
      </a-row>

			<a-button  @click="addCompound">
				<template #icon><PlusOutlined /></template>
			</a-button>

			<a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="Тип блюда" name="type">
            <a-select
								v-model:value="form.type"
								:options="state.options"
								mode="multiple"
								:size="'middle'"
								placeholder="Please select"
								style="width: 200px"
							></a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
				<a-col :span="12">
         <a-form-item label="Каллории" name="calories">
            <a-input type="number" v-model:value="form.calories" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
					<a-form-item label="Белки" name="proteins">
						<a-input type="number" v-model:value="form.proteins" />
					</a-form-item>
        </a-col>
      </a-row>

			<a-row :gutter="16">
				<a-col :span="12">
         <a-form-item label="Углеводы" name="carbohydrates">
            <a-input type="number" v-model:value="form.carbohydrates" />
          </a-form-item>
        </a-col>

        <a-col :span="12">
					<a-form-item label="Жиры" name="fast">
						<a-input type="number" v-model:value="form.fast" />
					</a-form-item>
        </a-col>
      </a-row>

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
				<a-button type="primary" danger ghost v-if="!state.loading" @click="toArchive">В Архив</a-button>
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
import { defineComponent, reactive, ref } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { toLocaleDatePicter } from '@/js/date.methods';

export default defineComponent({
  components: {
    LoaderSpin,
		PlusOutlined
  },
	props: {
		dishes_id: Number,
	},
  setup(props) {
    const store = useStore();

    const state = reactive({
      loading: false,
      compound: [],
			options: [
				{ value: 'Завтрак' },
				{ value: 'Полдник' },
				{ value: 'Обед' },
				{ value: 'Ужин' },
			],
    });

    const form = reactive({
      name: '',
      type: [],
      calories: 0,
      proteins: 0,
			carbohydrates: 0,
			fast: 0,
			description: ''
    });

    const rules = {
      name: [{
        required: true,
        message: 'Введите название',
      }],
    };
    const visible = ref(false);
    const showDrawer = async () => {
			const res = await store.dispatch("getOneDishes", props.dishes_id);
			if (!res.success) {
				onClose();
				return message.error(res.error || 'Произошла ошибка');
			}

			const { data } = res;
			form.name = data.name;
			state.compound = data.compound;
			form.type = data.type;
			form.calories = data.calories;
			form.proteins = data.proteins;
			form.carbohydrates = data.carbohydrates;
			form.fast = data.fast;
			form.description = data.description;

      visible.value = true;
    };
    const onClose = () => {
      visible.value = false;
    };
    const onSave = async (formaingData) => {
      state.loading = true;
      const result = await store.dispatch('updateDishes', formaingData);
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
        compound: state.compound,
				id: props.dishes_id
      });

      onSave(data); 
    }
    const onFinishFailed = () => {
      return message.error("Были допушены ошибки при заполнении");
    }

    const customFormat = (value) => {
      return toLocaleDatePicter(value)
    }

		const formatTitleCompound = (e, inx) => {
			const val = e.target?.value?.trim() || null;
			state.compound[inx].product = val;

			if (!val)
				state.compound = state.compound.filter((_, index) => (index != inx));
		}

		const formatDescriptionCompound = (e, inx) => {
			const val = e.target?.value?.trim() || null;
			state.compound[inx].parametrs = val;
		}

		const addCompound = () => {
			state.compound.push({ compound: '', parametrs: '' });
		}

		const toArchive = async () => {
			state.loading = true;
      const result = await store.dispatch('deleteDishes', props.dishes_id);
      state.loading = false;
			if (!result.success)
				message.error(result.error || "Произошла ошибка");

			message.success("Блюдо перенесено в архив");

			return onClose();
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


			formatTitleCompound,
			formatDescriptionCompound,
			addCompound,
			toArchive
    };
  },
});
</script>