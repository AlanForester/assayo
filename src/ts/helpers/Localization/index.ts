class Localization {
  language:string = 'ru';

  translations: any = {};

  get(key = '') {
    const dictionary = this.translations[this.language];
    if (!dictionary) return key || '';

    let message = dictionary[key];
    if (message) return message;

    const keys = key.split('.');
    message = dictionary;
    for (let i = 0, l = keys.length; i < l; i++) {
      message = message[keys[i]];
      if (!message) return key || '';
    }
    return message;
  }

  parse(langId: string, text: string) {
    text.split('§ ').slice(1).forEach((part: string) => {
      let index = part.indexOf('\n');
      if (index === (part.length - 1)) {
        index = part.indexOf(':');
      }
      const key = langId + '.' + part.slice(0, index);
      const value = part.slice(index + 1).trim();
      this.#addInTranslate(key, value);
    });
  }

  #addInTranslate(key: string, value: string) {
    const keys = key.split('.');
    let link = this.translations;
    for (let i = 0, l = keys.length; i < l; i++) {
      link[keys[i]] = i === (l - 1) ? value  : (link[keys[i]] || {});
      link = link[keys[i]];
    }
  }

  add(key: string, json: any) {
    if (json) {
      this.#addInObject(this.#createPathByKey(key), json);
    } else {
      this.#addInObject(this.translations, key);
    }
  }

  #createPathByKey(key: string) {
    const keys = key.split('.');
    let link = this.translations;
    for (let i = 0, l = keys.length; i < l; i++) {
      link[keys[i]] = link[keys[i]] || {};
      link = link[keys[i]];
    }
    return link;
  }

  #addInObject(source: any, target: any) {
    for (let key in target) {
      if (!source[key]) source[key] = {};
      if (typeof target[key] === 'object') {
        this.#addInObject(source[key], target[key]);
      } else {
        source[key] = target[key];
      }
    }
  }
}

const localization = new Localization();

export default localization;
