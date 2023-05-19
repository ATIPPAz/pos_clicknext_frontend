export async function getRequest(path) {
  const res = await fetch(path)
    .then((e) => e.json())
    .catch((er) => {
      console.log(er)
      return { statusCode: 500, data: { massage: 'server error' } }
    })
  return res
}

export async function updateRequest(path = '', data = {}, type = '') {
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': type == '' ? 'application/json' : type,
    },
    body: JSON.stringify(data),
  })
    .then((e) => e.json())
    .catch((e) => (e.statusCode = 500))
  return res
}

export async function createRequest(path = '', data = {}, type = '') {
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': type == '' ? 'application/json' : type,
    },
    body: JSON.stringify(data),
  })
    .then((e) => e.json())
    .catch((e) => {
      console.log(e)
      return {
        data: null,
        statusCode: 500,
      }
    })
  return res
}
export async function deleteRequest(path = '', id = {}) {
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(id),
  })
    .then((e) => e.json())
    .catch((e) => (e.statusCode = 500))
  return res
}
