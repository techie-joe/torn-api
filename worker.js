// worker.js
const response = {
  help: function help (request,env,url,parts) {
    return new Response([
      "Use /{route}/{section}/{id}/{selections}"
    ].join('\n'), { status: 400 });
  },
  v1: async function v1 (request,env,url,parts) {
    const route = parts[0];
    const section = parts[1];
    const id = parts[2];
    const selections = parts[3];
    if (!section) {
      return new Response([
        `Use /${route}/{section}/{id?}/{selections?}`
      ].join('\n'), { status: 400 });
    }
    const api = new URL([
      "https://api.torn.com" + (route === "v1" ?"":"/"+route),
      section, id
    ].join('/'));
    api.searchParams.set("key", env.TORN_API_KEY);
    api.searchParams.set("comment", "TORN_API");
    api.searchParams.set("selections", selections||"");
    url.searchParams.forEach(
      function setParams(v, k) {
        api.searchParams.set(k, v);
      }
    );
    const res = await fetch(api);
    if (!res.ok) {
      return new Response(JSON.stringify({
        error: "Upstream error",
        status: res.status
      }), { status: 502 });
    }
    const data = await res.text();
    const _headers = { "content-type": "application/json" };
    // if (["torn"].includes(section)) {
    // }
    _headers["cache-control"] = "max-age=60, s-maxage=300"; // 1min, 5min
    return new Response(data, {
      status: 200,
      headers: _headers
    });
  }
};
var worker_default = {
  async fetch(request,env) {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const route = parts[0];
    if (["v1", "v2"].includes(route)) {
      return response.v1(request,env,url,parts);
    }
    else {
      return response.help(request,env,url,parts);
    }
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
