const Mock = require('mockjs')

let data = Mock.mock({
  name: '@cname',
  'age|15-70': 1,
  'address': "@county(true)"
})

console.log(data)
