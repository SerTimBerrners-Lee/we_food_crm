import Req from "@/js/reg";

export default {
	state: {
		stages: [],
	},
	getters: {
		getStages(state) {
			return state.stages;
		},
	},
	actions: {
		async getStages(ctx, { page = 1, limit = 25, status = 0 }) {
			const res = await Req(`stage/get_all/${page}/${limit}/${status}`, {
				method: 'GET'
			});

			if (res.success && res.data)
				ctx.commit("get_all_stages", res.data);

			return res;
		},
		async fetchToDelivery(ctx, id) {
			const res = await Req(`stage/to_delivery/${id}`, {
				method: 'GET'
			});

			if (res.success)
				ctx.commit("delete_stages", id);

			return res;
		},
		async fetchToComplited(ctx, id) {
			const res = await Req(`stage/to_complited/${id}`, {
				method: 'GET'
			});

			if (res.success)
				ctx.commit("delete_stages", id);
				
			return res;
		}
	},
	mutations: {
		get_all_stages(state, stages) {
			state.stages = stages;
		},
		delete_stages(state, stages_id) {
			state.stages = state.stages.filter(el => el.id !== stages_id);
		}
	}
}