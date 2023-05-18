# todos

### Routes

- [x] view
- [ ] contact
- [ ] doublecheck [guard case](src/router/router.js)

### Contents

- [x] cache contents to reduce requests (?)
- [ ] chat

  - [ ] ChatContactItem component
  - [ ] template / text block

- [ ] about
- [ ] error

  - [ ] handle error messages in [Chat](src/renderer/renderer-utils.js#56) [renderer](src/renderer/renderer.js#36) [@](src/renderer/templates.js#31)
  - [ ] handle error messages in [Page](src/elements/controller-page.js#29)

- [ ] contact
- [ ] share - restructure or rewrite
  - [x] remove link to preview from options and add it as a chat message
  - [ ] add QRCode image - add npm pkg
  - [ ] Share API - navigator.canShare - Permissions (!) [listener.js](src/listener/listener.js#31)

### Templates

- [ ] add svgs to ['./elements.js'](src/elements/elements.js#18) (?)
- [ ] clearify [TMPL_ATTR](src/components/chat-message/component.js#11)
- [ ] restructure functions which are used by renderer.chat.js AND renderer.page.js [@](src/elements/controller-page.js#44)

### Animation

- [x] fadeIn
- [x] fadeOut
- [x] ~~calculate scrollTop instead of using scrollIntoView bc header overlaps section when section height is greater than 100 vh~~ smooth scroll
- [y] move all fade animations to removeChatModules()
- [ ] [initialRender](src/elements/controller-chat.js#26)
- [x] pending indicator
- [ ] [Error Message](src/elements/controller-chat.js#73)
- [x] is writing indicator
- [x] ~~ChatLink component should be responsible (?)~~
- [ ] Loading Indicator on Page
- [x] Animation when Back / Reset ChatLink was clicked

### Refactor

- [x] chained animation promises
- [ ] thems [css](src/style/theme.css#100)
