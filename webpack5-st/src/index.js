import { count, sum, sleep } from '@/count'
import '@/style/box.css'
import '@/style/box1.less'
import '@/style/box2.scss'

console.error(count(2, 1))
console.error(sum(1, 2, 3))
sleep(5000).then(res => console.error(res))
