import Req from "@/js/reg";

export default {
	state: {
		promo: []
	},
	getters: {
		getPromo(state) {
			return state.promo;
		},
	},
	actions: {
		async createPromo(ctx, data) {
			const res = await Req('promo/create', {
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'POST',
				body: data
			});

			if (res.success && res.data) 
				ctx.commit("add_promo", res.data);
				
			return res;
		},
		async updatePromo(ctx, data) {
			const res = await Req('promo/update', {
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'PUT',
				body: data
			});

			if (res.success && res.data) 
				ctx.commit("update_promo", res.data);
				
			return res;
		},
		async getAllPromo(ctx) {
			const res = await Req(`promo/get_all/`, {
				method: 'GET'
			});

			if (res.success && res.data)
				ctx.commit("get_all_promo", res.data);

			return res;
		},
	},
	mutations: {
		get_all_promo(state, promo) {
			state.promo = promo;
		},
		add_promo(state, promo) {
			state.promo.push(promo);
		},
		update_promo(state, promo) {
			state.promo = state.promo.filter(el => el !== promo.id);
			state.promo.push(promo);
		}
	}
}