export default {
  async fetch(request, env) {
    // return new Response("Hello world")

    const API_KEY = TORN_API_KEY
    
    const url = new URL(request.url)
    const parts = url.pathname.split("/")
    if (parts.length < 3) {
      return new Response("Use /user/ID")
    }

    const user = parts[2]
    const selections = parts[3]
    const api = `https://api.torn.com/user/${user}?key=${API_KEY}&selections=${selections}`
    const response = await fetch(api)
    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: {
        "content-type": "application/json"
      }
    })

  }
}