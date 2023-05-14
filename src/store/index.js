import { createStore } from 'vuex';
import users from './modules/users';
import auth from './modules/auth';
import product_line from './modules/product_line';
import orders from './modules/orders';
import dishes from './modules/dishes';
import stages from './modules/stages';
import kitchen from './modules/kitchen';

export default createStore({
	modules: {
		users,
		auth,
		product_line,
		orders,
		dishes,
		stages,
		kitchen
	}
});
