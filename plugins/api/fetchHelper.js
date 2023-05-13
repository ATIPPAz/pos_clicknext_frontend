export async function getRequest(path) {
  const res = await fetch(path).then((e) => e.json())
  console.log(res)
  return res
}

export async function updateRequest(path = '', data = {}, type = '') {
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': type == '' ? 'application/json' : type,
    },
    body: JSON.stringify(data),
  }).then((e) => e.json())
  return res
}

export async function createRequest(path = '', data = {}, type = '') {
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': type == '' ? 'application/json' : type,
    },
    body: JSON.stringify(data),
  }).then((e) => e.json())
  return res
}
export async function deleteRequest(path = '', id = {}) {
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(id),
  }).then((e) => e.json())
  return res
}
