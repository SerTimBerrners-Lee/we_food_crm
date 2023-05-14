import { PATH_TO_SERVER } from '@/js/path';

const Req = async (query, option = {}) => {
	const auth_data = localStorage.getItem("WE_FOOD_CRM_AUTH");
	try {

		const auth = auth_data ? JSON.parse(auth_data) : null;
		const options = option;

		if (auth && auth?.token) {
			const headers = option.headers || {};

			option.headers = {
				'Authorization': `Bearer ${auth.token}`,
				...headers
			}
		}

		const result = await fetch(`${PATH_TO_SERVER}/api/${query}`, options);
		const res = await result.json();
		return res;

	} catch (err) {
		console.error(err);
	}
}


export default Req;
