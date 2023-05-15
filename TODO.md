# todos

### Routes

- [x] view
- [ ] contact

### Contents

- [ ] cache contents to reduce requests (?)
- [ ] chat

  - [ ] ChatContactItem component
  - [ ] template / text block

- [ ] about
- [ ] error

  - [ ] handle error messages in Chat [@](src/renderer/render.chat.js#108)
  - [ ] handle error messages in Page [@](src/renderer/render.page.js#30)

- [ ] contact
- [ ] share - restructure or rewrite
  - [x] remove link to preview from options and add it as a chat message
  - [ ] add QRCode image - add npm pkg
  - [ ] Share API - navigator.canShare - Permissions (!) [@](src/listener/listener.js#31) [@](src/templates/utils.js#28)

### Templates

- [ ] add svgs to './elements.js' (?)
- [ ] restructure functions which are used by renderer.chat.js AND renderer.page.js [@](src/renderer/render.chat.js#136) [@](src/renderer/render.page.js#44)
- [ ] inconsistent [@](src/templates/templates.js#8) [@](src/templates/templates.js#36)

### Animation

- [x] fadeIn
- [x] fadeOut [@](src/renderer/render.chat.js#31)
- [x] ~~calculate scrollTop instead of using scrollIntoView bc header overlaps section when section height is greater than 100 vh~~ smooth scroll
- [ ] initialRender [@](src/renderer/render.chat.js#35)
- [x] ~~loading spinner [@](src/renderer/utils.js#38)~~
- [x] is writing indicator
- [x] ~~ChatLink [@](src/components/chat-link/component.js#110) [@](src/renderer/render.chat.js#86)~~
- [ ] Loading Indicator on Page [@](src/renderer/utils.js#10)
- [ ] ChatLink component should be responsible (?)
- [ ] Animation when Back / Reset ChatLink was clicked [@](src/renderer/render.chat.js#56)

### Refactor

- [ ] [@](src/renderer/render.chat.js)
- [ ] chained animation promises [@](src/renderer/transition.js)
