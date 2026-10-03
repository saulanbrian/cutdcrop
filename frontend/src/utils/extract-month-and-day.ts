export default function extractMonthAndDay(dateText: string) {
  const date = dateText.split('T')[0]
  const [, month, day] = date.split('-')
  return `${month}/${day}`
}
