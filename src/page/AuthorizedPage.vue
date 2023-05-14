
<template>
	<a-layout>
		<a-layout-content class="main">
			<div class="auth">
				<h3>We Food</h3>
				<a-input v-model:value="email" placeholder="Email" />
				<a-input-password v-model:value="password" placeholder="Password" />
				<a-button type="primary" :size="'large'" @click="onAuth" v-if="!loading">Войти</a-button>
				<LoaderSpin v-else />
			</div>
		</a-layout-content>
	</a-layout>
</template>

<script>
import { mapActions } from 'vuex';
import { message } from 'ant-design-vue';
import LoaderSpin from '@/components/LoaderSpin';

export default {
	data() {
		return {
			email: '',
			password: '',
			loading: false
		}
	},
	components: {
		LoaderSpin
	},
	methods: {
		...mapActions(['fetchAuth']),
		async onAuth() {
			if (!this.email || !this.password)
				return message.warn("Введите данные");

			const email = this.email.trim();
			const password = this.password.trim();

			this.loading = true;
			const res = await this.fetchAuth({email, password});
			this.loading = false;
			if (res.success === false)
				message.error(res.error || "Произошла ошибка");
		}
	}
}
</script>

<style scoped>
.main {
	background: url('@/assets/bg-lending.png') no-repeat;
	background-size: 100%;
	background-color: rgb(0, 0, 0);
	width: 100vw;
	height: 100vh;
	padding: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	
}
.auth {
	width: 450px;
	min-height: 300px;
	background: white;
	border: 2px solid rgb(0, 0, 0);
	border-radius: 4px;
	padding: 20px;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
}

.auth>input, .auth>.ant-input-password, .auth>button {
	margin-top: 20px;
	width: 90%;
}

.auth>h3 {
	font-size: 24px;
	font-weight: bold;
	text-align: center;
}
</style>