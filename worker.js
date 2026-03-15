export default {
  async fetch(request, env) {
    // return new Response("Worker is running")

    const url = new URL(request.url)
    const parts = url.pathname.split("/").filter(Boolean)

    const section = parts[0]
    const id = parts[1]
    const selections = parts[2]

    if (!section) {
      return new Response("Use /{section}/{id}/{selections}", { status: 400 })
    }
    else if (section === "user" && !id) {
      return new Response("Use /user/{id}/{selections}", { status: 400 })
    }

    const api = new URL(`https://api.torn.com/${section}/${id}`)
    api.searchParams.set("key", env.TORN_API_KEY)
    api.searchParams.set("comment", 'TORN_API')

    if (selections) {
      api.searchParams.set("selections", selections)
    }

    const response = await fetch(api)
    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: {
        "content-type": "application/json",
        // "cache-control": "max-age=60"
      }
    })

  }
}