export const linkifyText = (txt) => {
  const hashPattren = /\B(#[a-zA-Z0-9]+\b)(?!;)/g;
  const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  const emailPattren = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
  const pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  const userTags = /\B(@[a-zA-Z0-9]+\b)(?!;)/g;
  if (txt) {
    // replaces hashes with a span element
    return txt.replace(
      hashPattren,
      `<span title="$1" class="link--element">$1</span>`
    ).replace(
      // replaces urls with valid links
      urlPattern,
      `<a class="link--element" href="$1" target="_blank">$1</a>`
    ).replace(
      // replaces pseudoUrls with valid links
      pseudoUrlPattern,
      `$1<a class="link--element" href="https://$2" title="$1" target="_blank">$2</a>`
    ).replace(
      // replaces emails with mailto links
      emailPattren,
      `<a class="link--element" title="$1" href="mailto:$1">$1</a>`
    ).replace(
      // replaces user tags with a span element
      userTags,
      `<span class="link--element" title="$1">$1</span>`
    )
  }
};