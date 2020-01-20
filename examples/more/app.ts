import axios from '../../src/index'

document.cookie = 'a=b'

// tslint:disable-next-line: no-floating-promises
axios.get('/more/get').then(res => {
    console.log(res)
})

// tslint:disable-next-line: no-floating-promises
axios.post('http://127.0.0.1:8088/more/server2', {}, {
    withCredentials: true
}).then(res => {
    console.log(res)
})