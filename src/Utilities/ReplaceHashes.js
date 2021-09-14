export const linkifyText = (txt) => {
  const hashPattren = /\B(#[a-zA-Z0-9]+\b)(?!;)/g;
  const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  const emailPattren = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
  const pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  const userTagsPattren = /\B(@[a-zA-Z0-9]+\b)(?!;)/g;
  const phoneNumbersPattren = /((?:|^)(?:\+\d{1,3}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})(?:\b)/;
  if (txt) {
    // replaces hashes with a span element
    return txt.replace(
      hashPattren,
      `<span class="link--element" title="$1">$1</span>`
    ).replace(
      // replaces urls with valid links
      urlPattern,
      `<a class="link--element"  href="$1"  target="_blank" title="Visit $1">$1</a>`
    ).replace(
      // replaces pseudoUrls with valid links
      pseudoUrlPattern,
      `$1<a class="link--element" href="https://$2" target="_blank" title="Visit $2">$2</a>`
    ).replace(
      // replaces emails with mailto links
      emailPattren,
      `<a class="link--element" href="mailto:$1" title="Email $1">$1</a>`
    ).replace(
      // replaces user tags with a span element
      userTagsPattren,
      `<span class="link--element" title="$1">$1</span>`
    ).replace(
      // replaces phone numbers with an action that will call the number if it got pressed on
      phoneNumbersPattren,
      `<span class="link--element" onclick="window.open('tel:$&')" class="hashtag" title="Call $&">$&</span>`
       // alternative `<a class="hashtag" title="Call $&" href="tel:$&"">$&</a>`
    )
  }
};