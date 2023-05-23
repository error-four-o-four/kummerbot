# todos

### Routes

- [x] view
- [ ] send user to a new route to send a message and when the message was send. Implies to remove 'renderer-page.js' and use the custom component ChatModule in every route: /chat, /shared, /message, /processed (or url param) and /about.
  - [ ] redirect to /error from /message when `requiredEmailValue === null` [@](src/listener/form-handler.js#80) [@](src/router/router.js#136)
  - [ ] redirect to /error when /processed when `processing === null`

### Contents

- [x] chat

- [ ] about
- [ ] error

  - [ ] handle and pass error messages to ChatMessage
  - [ ] doublecheck possible cases

- [x] contact

  - [ ] create API to send messages [@](src/listener/form-handler.js#16)
  - [ ] add email regex. might not be necessary because there's no user input
  - [ ] set attribute 'pending' when message was send [@](src/listener/form-handler.js#101)
  - [ ] adjust attribute 'cols' in 'resized' event [@](src/listener/form-handler.js#112)

- [x] share - restructure or rewrite
  - [x] remove link to preview from options and add it as a chat message
  - [ ] ~~add QRCode image - add npm pkg~~
  - [ ] Share API - navigator.canShare - Permissions
  - [ ] Copy URL [@](src/listener/button-handler.js)

### Templates

- [x] template / text block
- [x] cache contents to reduce requests
- [ ] add svgs to ['./elements.js'](src/elements/elements.js#18) (?)
- [x] clearify [TMPL_ATTR](src/components/chat-message/component.js#11)
- [ ] ~~restructure functions which are used by renderer.chat.js AND renderer.page.js~~
- [ ] doublecheck selectors and keys. who's responsible? templates.js vs components
- [ ] create a template file for /share, /message and /processed
- [ ] [refactor](src/renderer/templates.js#21)

### Components

- [ ] (re)move AboutLink to elements.js (?)

#### ChatModule

- [ ] restructure [chat-module/render.js](src/components/chat-module/render.js)
- [ ] refactor [insertChatLinks](src/components/chat-module/render.js#109)
- [ ] pass error message as argument [@](src/components/chat-module/component.js#67)
- [ ] add a case to decide when to call ContactItem.update(href) [@](src/components/chat-module/render.js#50)

#### ChatLink

- [ ] add condition: do not always update the href value [@](src/components/chat-link/component.js#80)
- [ ] doublecheck possible cases [@](src/components/chat-link/component.js)

#### ContactItem

- [x] ChatContactItem component
- [ ] convert characters to html entities in title [@](src/components/contact-item/utils.js#65)
- [ ] refactor [injectContactData](src/components/contact-item/utils.js#95)

### Animation

- [x] fadeIn
- [x] fadeOut
- [x] ~~calculate scrollTop instead of using scrollIntoView bc header overlaps section when section height is greater than 100 vh~~ smooth scroll
- [ ] add css attribute 'scroll-padding' [@](src/renderer/animation.js#4)
- [x] move all fade animations to removeChatModules()
- [ ] [initialRender](src/renderer/renderer-chat.js#33)
- [x] pending indicator
- [ ] [Error Message](src/renderer/renderer-chat.js#49)
- [x] is writing indicator
- [x] ~~ChatLink component should be responsible (?)~~
- [ ] Loading Indicator on Page
- [x] Animation when Back / Reset ChatLink was clicked
- [ ] sometimes the attribute 'loading' is not set on ContactItem on load
- [ ] finish all pending animation in popstate event [@](src/listener/listener.js#13) [@](src/renderer/animation.js#81)
- [ ] deactive animations in /shared route when router.hasChanged [@](src/renderer/animation.js#86)

### Refactor

- [x] chained animation promises
- [x] themes [css](src/style/theme.css#100)
- [ ] collect util functions
  - [ ] [@](src/renderer/animation.js#76)
  - [ ] setBooleanAttribute()
