export const Base64 = {
  encode(str: string) {
    return btoa(unescape(encodeURIComponent(str)));
  },
  decode(str: string) {
    return decodeURIComponent(escape(atob(str)));
  }
};
