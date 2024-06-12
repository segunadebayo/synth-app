export async function fetchImages(page = 1, perPage = 30) {
  const url = `https://picsum.photos/v2/list?page=${page}&limit=${perPage}`
  return fetch(url).then((res) => res.json())
}
