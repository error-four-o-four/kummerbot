// const data = await fetch('/views/templates.html');
// const text = await data.text();

// const parser = new DOMParser();
// const templates = [...parser.parseFromString(text, 'text/html').head.children];

const wrap = document.getElementById('templates-container');
// wrap.append(...templates.slice(9));

// @todo
// <template id="message-tmpl-error">
//   <p>$&#x26A0; Da hat etwas nicht funktioniert ...</p>
//   <!-- <p>Hier erscheint eine Fehlermeldung</p> -->
//   <p>
//     Versuche die Seite neu zu laden oder<br />
//     kehre zur&uuml;ck zur <a>Startseite</a>
//   </p>
// </template>

// dynamic contents
const cachedModuleIds = [];
const cachedMessageIds = [];

export default {
  hash(key) {
    // matches template ids
    // tmpl-module-share
    // tmpl-module-message => send message
    return `module-tmpl-${key}`;
  },
  isCachedMessage(id) {
    return cachedMessageIds.includes(id);
  },
  isCachedModule(id) {
    return cachedModuleIds.includes(id);
  },
  get(id) {
    // @todo meh
    return wrap.children[id].innerHTML;
  },
  set(element, id = null) {
    // store all children of a ChatModule
    // in a template element
    // and append it to the wrapper
    // if an id was passed as an argument
    if (!!id) {
      const template = document.createElement('template');
      template.id = id;
      template.innerHTML = element.innerHTML;

      wrap.appendChild(template);
      cachedModuleIds.push(id);
      return;
    }

    // the element is a template of a ChatMessage component
    // templates are attached to the fetched .html files
    // and stored when the file is fetched
    // but before the ChatModule is rendered
    wrap.appendChild(element);
    cachedMessageIds.push(element.id);
  },
};
