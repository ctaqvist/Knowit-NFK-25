const WebSocket = require('ws')

const ws = new WebSocket('ws://test.lazyloops.se:9100')

ws.on('open',()=> {
    setInterval(()=>{
        const now = Date.now();
        ws.send(JSON.stringify({timestamp : now}))
    }, 100)
    console.log(now)
}
)