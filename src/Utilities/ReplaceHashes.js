export const findNReplaceHash = (txt) => {
    if (txt) {
      return txt.replace(
        /\B(#[a-zA-Z]+\b)(?!;)/g,
        `<span class="hashtag">$1</span>`
      );
    }
  };