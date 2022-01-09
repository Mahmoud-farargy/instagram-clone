
export const updateObject = (oldObject, newObject) =>{
    const deepClonedObj = JSON.parse(JSON.stringify(oldObject));
    return {
        deepClonedObj,
        ...newObject
    }
}

export function disableReactDevTools() {
    // Check if the React Developer Tools global hook exists
    if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== "object") {
      return;
    }
    for (const prop in window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      if (prop === "renderers") {
        // this line will remove that one console error
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__[prop] = new Map()
      } else {
        // Replace all of its properties with a no-op function or a null value
        // depending on their types
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__[prop] =
          typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__[prop] === "function"
            ? () => {}
            : null;
      }
    }
  }
export const capFirstLetter = (txt) => typeof txt === "string" ? (`${txt.charAt(0)?.toUpperCase()}${txt.slice(1)}`): "";
export const lowerCaseString = (txt) => typeof txt === "string" ? txt?.toLowerCase() : "";