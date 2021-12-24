export function useQueryParams() {
  const params = new URLSearchParams(
    window ? window.location.search : {}
  )

  return new Proxy(params, {
      get(target, prop) {
          return target.get(prop as string)
      },
  });
}