# todos

### Routes

- [ ] view [@](src/components/chat-link/config.js#65)
- [ ] contact

### Contents

- [ ] cache contents to reduce requests (?)
- [ ] chat

  - [ ] ChatContactItem component
  - [ ] template / text block [@](src/renderer/templates.js#4) [@](src/style/main.css#88)

- [ ] about
- [ ] error

  - [ ] pass error message [@](src/renderer/render.page.js#25)

- [ ] contact
- [ ] share - restructure or rewrite [@](public/views/chat/share.html#11)
  - [ ] remove link to preview from options and add it as a chat message
  - [ ] add QRCode image - add npm pkg
  - [ ] Share API - navigator.canShare

### Animation

- [x] fadeIn
- [ ] fadeOut [@](src/renderer/render.chat.js#31)
- [ ] calculate scrollTop instead of using scrollIntoView bc header overlaps section when section height is greater than 100 vh
- [ ] initialRender [@](src/renderer/render.chat.js#22) [@](src/renderer/renderer.js#7)
- [ ] loading spinner [@](src/renderer/utils.js#38)
- [ ] is writing indicator
- [ ] ChatLink [@](src/components/chat-link/component.js#110) [@](src/renderer/render.chat.js#86)
