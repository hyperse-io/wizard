export async function sleep(ms = 100) {
  return await new Promise<void>((resolver) => {
    setTimeout(resolver, ms);
  });
}
