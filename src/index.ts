export default {
  async fetch(request: Request) {
    try {
      return await handleRequest(request)
    } catch (e) {
      return new Response(`${e}`)
    }
  },
}

async function handleRequest(request: Request) {
  const url = new URL(request.url)
  const site = url.searchParams.get('site')
  if (site == null) {
    return new Response('must specify site query', {status: 400})
  }
  const refreshMillis = parseInt(url.searchParams.get('refresh') || '10') * 1000
  console.log({refreshMillis})



  const resp = await fetch(site)

  const injected = RefreshInjector(refreshMillis).transform(resp)

  return injected
}

const RefreshInjector = function(millis: number): HTMLRewriter {
  return new HTMLRewriter()
      .on('body', {
        element(element: Element): void | Promise<void> {
          element.append(
              `<script>setTimeout(function(){window.location.reload()}, ${millis})</script>`,
              {html: true})
        },
      })
}