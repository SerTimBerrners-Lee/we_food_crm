import Req from "@/js/reg";

export default {
	state: {
		auth: localStorage.getItem("WE_FOOD_CRM_AUTH") ? JSON.parse(localStorage.getItem("WE_FOOD_CRM_AUTH")) : null,
	},
	getters: {
		isAuth(state) {
			return state.auth || null;
		},
		authUser(state) {
			return state?.auth?.user || null; 
		}
	},
	actions: {
		async fetchAuth(ctx, { email, password }) {
			const res = await Req(`login_crm`, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			if (res.success && res.data)
				ctx.commit("auth_user", res.data);

			return res;
		}
	},
	mutations: {
		logout(state) {
			localStorage.removeItem("WE_FOOD_CRM_AUTH");
			state.auth = null;
		},
		auth_user(state, data) {
			const auth_data = JSON.stringify(data);

			localStorage.setItem("WE_FOOD_CRM_AUTH", auth_data);
			state.auth = data;
		}
	}
}