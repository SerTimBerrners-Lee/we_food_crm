import Req from "@/js/reg";

export default {
	state: {},
	getters: {},
	actions: {
		async formNewStageToday() {
			const res = await Req(`kitchen/form_new_stage_today`, {
				method: 'GET'
			});

			return res;
		},
	},
	mutations: {}
}