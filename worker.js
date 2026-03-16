// worker.js
const response_headers = {
  "cache-control": "max-age=60" // 60 sec
};
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
        `Use /${route}/{section}/{id}/{selections}`
      ].join('\n'), { status: 400 });
    } else if (!id) {
      return new Response([
        `Use /${route}/${section}/{id}/{selections}`
      ].join('\n'), { status: 400 });
    }
    const api = new URL(`https://api.torn.com/${section}/${id}`);
    api.searchParams.set("key", env.TORN_API_KEY);
    api.searchParams.set("comment", "TORN_API");
    if (selections) {
      api.searchParams.set("selections", selections);
    }
    const response = await fetch(api);
    const data = await response.json();
    response_headers["content-type"] = "application/json";
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: response_headers
    });
  },
  v2: async (parts,env)=>{
    const route = parts[0];
    const section = parts[1];
    const id = parts[2];
    const selections = parts[3];
    if (!section) {
      return new Response([
        `Use /${route}/{section}/${id}/${selections}`
      ].join('\n'), { status: 400 });
    } else if (!id) {
      return new Response([
        `Use /${route}/${section}/{id}/{selections}`
      ].join('\n'), { status: 400 });
    }
    return new Response([
      `Use /${route}/${section}/${id}/${selections}`
    ].join('\n'), { status: 400 });
  }
};
var worker_default = {
  async fetch(request,env) {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const route = parts[0];
    if (response[route]) {
      return response[route](parts,env);
    }
    else {
      return response.help();
    }
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
