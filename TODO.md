# todos

### Routes

- [ ] doublecheck each route when it's the landing page
- [x] doublecheck `adjustChatLinksToRoute(output, properties)` in each route
- [x] consider moving `render-utils/adjustChatLinksToRoute(output, properties)` to renderer/renderElements.js
- [ ] doublecheck ChatLink.target="back" in each route (use historyController) [@](src/components/chat-link/chat-link.js#72) [@](src/components/chat-link/chat-link.js#90) [@](src/components/chat-module/utils.js#111) [@](src/router/router.js#13) [@](src/router/router.js#159)
  - [x] chat
  - [x] shared
  - [ ] contact
  - [ ] about => first view !
  - [x] error

- [x] shared

  - [x] load 'message-tmpl-contacts-info' in /shared route when it's the landing page view
  - [x] remove attribute class 'is-transparent' from ContactItem when redirected from /chat or clean attributes _before_ (?) caching awaited/promised ContacItem components
  - [x] remove all needless elements (e.g. span#message-pending-indicator) _before_ caching promised ContactItem components

- [x] send user to a new route to send a message and when the message was send. Implies to remove 'renderer-page.js' and use the custom component ChatModule in every route: /chat, /shared, /message, /processed (or url param) and /about.

  - [x] use a contact state to

    - [x] redirect to /error from /message when `requiredEmailValue === null` [@](src/listener/form-handler.js#80) [@](src/router/router.js#136)
    - [x] ~~redirect to /error when /processed when `processing === null`~~

  - [x] route validation
  - [ ] `handleSubmit()` [@](src/handler/event-handler.js#56), router.onSubmit()

- [x] create handler/errorHandler
- [x] move data/index.js => handler/dataHandler, move formHandler (?)
- [ ] formController.js

### Contents

- [x] chat

- [ ] about

  - [ ] make AboutLink bigger => styles
  - [ ] bug: back button doesn't work when routed from /contact => /about =/=> /contact

- [ ] error

  - [x] handle and pass error messages to ChatMessage
  - [ ] use a default message [@](src/controller/error-controller.js)
  - [ ] doublecheck possible cases
  - [ ] doublecheck ContactList component error

- [x] contact

  - [ ] create API to send messages
  - [ ] ~~add email regex. might not be necessary because there's no user input~~
  - [ ] adjust attribute 'cols' in 'resized' event
  - [ ] pass data key from button to contactHandler !
  - [x] refactor data and dataHandler => add property 'tags' which is associated with the loaded .html-file (requires updating renderer)
  - [ ] security: sanitize textarea.value
  - [ ] render dynamic ChatMessage contents [@](src/components/chat-message/chat-message.js#61) [@](src/components/chat-message/utils.js#54)
  - [ ] captcha-validator [@](src/components/chat-message/utils.js#51)
  - [ ] doublecheck css: disable resizable textarea (?)

- [x] share - restructure or rewrite
  - [x] remove link to preview from options and add it as a chat message
  - [ ] ~~add QRCode image - add npm pkg~~
  - [ ] Share API / navigator.canShare / Permissions [@](src/listener/button-handler.js)
  - [x] Copy URL [@](src/listener/button-handler.js)

### Templates

- [x] template / text block
- [x] cache contents to reduce requests
- [ ] add svgs to ['./elements.js'](src/elements/elements.js#18) (?)
- [x] clearify TMPL_ATTR
- [x] ~~restructure functions which are used by renderer.chat.js AND renderer.page.js~~
- [x] doublecheck selectors and keys. who's responsible? templates.js vs components => components
- [x] create a template file for /share, /contact and /processed
- [x] remove needless elements and attributes of ChatModule with ContactItems before it's stored in cache
- [x] ~~refactor~~

### Components

- [ ] (re)move AboutLink ~~to elements.js~~ create HeaderComponent
- [ ] create ContactForm component
- [x] fix route when clicked on header back button (?)
- [ ] chat-module/utils.js "@refactor styles 'is-hidden' @consider do not add any class attributes'" (?)

#### ChatModule

- [x] restructure chat-module/render.js
- [x] refactor insertChatLinks
- [x] ~~pass error message as argument~~
- [x] ~~add a case to decide when to call ContactItem.update(href)~~ obsolete bc href value is static

#### ChatLink

- [x] add condition: do not always update the href value
- [ ] doublecheck possible cases

#### ~~ContactItem~~ => ContacList

- [x] ChatContactItem component
- [x] convert characters to html entities in title [@](src/components/contact-item/utils.js#65)
- [x] refactor `injectContactData`
- [x] display loaded ContactItems after last ChatMessage has faded in

### Renderer / Animation

- [x] fadeIn
- [x] fadeOut
- [x] ~~calculate scrollTop instead of using scrollIntoView bc header overlaps section when section height is greater than 100 vh~~ smooth scroll
- [x] add css attribute 'scroll-padding'
- [x] move all fade animations to removeChatModules()
- [ ] initialRender => use `router.hasChanged` and `router.hasPopped`
- [x] pending indicator
- [x] Error Message
- [x] is writing indicator
- [x] ~~ChatLink component should be responsible (?)~~
- [ ] Loading Indicator on Page
- [x] Animation when Back / Reset ChatLink was clicked
- [ ] ~~doublecheck - sometimes the attribute 'loading' is not set on ContactItem on load~~
- [ ] finish all pending animation in popstate event [@](src/router/router.js#110)
- [ ] deactive animations in /shared route when router.hasChanged
- [ ] update 'renderAllElements()' animation and doublecheck in each route
- [ ] fade ChatLink components in after elements have been removed
- [x] ~~promisify animation (fadeChatLinksIn) has ended before displaying loaded contacts~~ solved with ContactList component
- [ ] change `renderer.transition`. it should be a property of `animation` [@](src/renderer/renderer.js)
- [ ] add css attribute to reset pointer while `renderer.transition === true` [@](src/renderer/renderer.js#43)
- [ ] move `isMobileDevice`. it could be a property of 'renderer'

### Refactor

- [x] chained animation promises
- [x] themes [css](src/style/theme.css#100)
- [ ] renderer/renderElements.js `checkCurrentStep(step, next)` [@](src/renderer/renderElements.js#53)
- [ ] code splitting
- [ ] collect util functions
  - [ ] delay [@](src/renderer/animation.js#76)
  - [x] setBooleanAttribute()
