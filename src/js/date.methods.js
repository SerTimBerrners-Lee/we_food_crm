export const toLocaleDatePicter = function(value) {
	let date = null;
	if (value._i && typeof value._i === 'object')
		date = value._i;
	if (value._d && typeof value._d === 'object')
		date = value._d;
	if (value.$d && typeof value.$d === 'object')
		date = value.$d;

	if (!date) return null;
	return (new Date(date).toLocaleString('ru-RU').split(',')[0]);
}

export const getDaysDiff = (dateStr1, dateStr2 = new Date().toLocaleDateString('ru-RU')) => {
  const [day1, month1, year1] = dateStr1.split('.').map(Number);
  const [day2, month2, year2] = dateStr2.split('.').map(Number);
  const date1 = new Date(year1, month1 - 1, day1);
  const date2 = new Date(year2, month2 - 1, day2);
  const timeDiff = date2.getTime() - date1.getTime();

  return Math.round(timeDiff / (1000 * 60 * 60 * 24));
}
