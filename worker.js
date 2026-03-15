export default {
  async fetch(request, env) {
    // return new Response("Worker is running")

    const url = new URL(request.url)
    const parts = url.pathname.split("/")

    if (parts.length < 3) {
      return new Response("Use /user/ID")
    }

    const user = parts[2]
    const selections = parts[3]
    const api = `https://api.torn.com/user/${user}?key=${env.TORN_API_KEY}&selections=${selections}`

    const response = await fetch(api)
    const data = await response.text()

    return new Response(data, {
      headers: {
        "content-type": "application/json"
      }
    })

  }
}