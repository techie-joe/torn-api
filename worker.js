// worker.js
const response = {
  help: ()=>{
    return new Response([
      "Use /{route}/{section}/{id}/{selections}"
    ].join('\n'), { status: 400 });
  },
  v1: async (parts,env)=>{
    const route = parts[0];
    const section = parts[1];
    const id = parts[2];
    const selections = parts[3];
    if (!section) {
      return new Response([
        `Use /${route}/{section}/{id?}/{selections?}`
      ].join('\n'), { status: 400 });
    }
    const api = new URL(`https://api.torn.com/${section}`+ (id ? `/${id}` : ""));
    api.searchParams.set("key", env.TORN_API_KEY);
    api.searchParams.set("comment", "TORN_API");
    if (selections) {
      api.searchParams.set("selections", selections);
    }
    const res = await fetch(api);
    if (!res.ok) {
      return new Response(JSON.stringify({
        error: "Upstream error",
        status: res.status
      }), { status: 502 });
    }
    const data = await res.text();
    return new Response(data, {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "max-age=60"
      }
    });
  },
  v2: async (parts,env)=>{
    const route = parts[0];
    const section = parts[1];
    const id = parts[2];
    const selections = parts[3];
    if (!section) {
      return new Response([
        `Use /${route}/{section}/{id?}/{selections?}`
      ].join('\n'), { status: 400 });
    }
    const api = new URL(`https://api.torn.com/v2/${section}`+ (id ? `/${id}` : ""));
    api.searchParams.set("key", env.TORN_API_KEY);
    api.searchParams.set("comment", "TORN_API");
    if (selections) {
      api.searchParams.set("selections", selections);
    }
    const res = await fetch(api);
    if (!res.ok) {
      return new Response(JSON.stringify({
        error: "Upstream error",
        status: res.status
      }), { status: 502 });
    }
    const data = await res.text();
    return new Response(data, {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "max-age=60"
      }
    });
  }
};
var worker_default = {
  async fetch(request,env) {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const route = parts[0];
    switch (route) {
      case "v1":
        return response.v1(parts,env);
      case "v2":
        return response.v2(parts,env);
      default:
        return response.help();
    }
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
