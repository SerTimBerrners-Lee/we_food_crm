<template>
  <div style="background: #ececec; padding: 30px" class="container_instruction">
    <a-card title="Работа с новым пользователем" :bordered="false" style="width: 40%">
			<a-timeline>
				<a-timeline-item>Клиент оставляет заявку на сайте, он появится в кладке Пользователи -> новые пользователи</a-timeline-item>
				<a-timeline-item>Мы перезваниваем клиенту по указаному номеру, и узнаем у него данные: Имя, Адресс и т.д. Если мы дозвонили до пользователя и узнали все данные - подтверждаем статус клиента, если не дозванились оставляем все как есть.</a-timeline-item>
				<a-timeline-item color="green">Клиент перемещается в раздел Все пользователи.</a-timeline-item>
			</a-timeline>
    </a-card>

		<a-card title="Обработка нового заказа" :bordered="false" style="width: 40%">
			<a-timeline>
				<a-timeline-item>Клиент создает заказ на сайте через главную страницу или же через личный кабинет.</a-timeline-item>
				<a-timeline-item>Мы перезваниваем клиенту по указаному номеру, и узнаем у него данные по заказу: уточняем Адресс доставки и другие данные по заказу.</a-timeline-item>
				<a-timeline-item color="green">Если все верно, подтверждаем заказ - он переместится в раздел "Актуальные заказы", если клиент хочет отменить заказ - отменяем заказ, он больше не появится в списке.</a-timeline-item>
			</a-timeline>
    </a-card>
  </div>
</template>

<style scoped>
.container_instruction {
	display: flex;
	justify-content: space-around;
}
</style>