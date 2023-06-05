# todos

### Routes

- [x] doublecheck each route when it's the landing page
- [x] doublecheck `adjustChatLinksToRoute(output, properties)` in each route
- [x] consider moving `render-utils/adjustChatLinksToRoute(output, properties)` to renderer/renderElements.js
- [x] doublecheck ChatLink.target="back" in each route (use historyController)

  - [x] chat
  - [x] shared
  - [x] contact
  - [x] about
  - [ ] bug: use pushState when routing from /contact/message to /about
  - [x] error; @bug: /error => /about: 'zurück' => /error: backLink => /about

- [ ] popstate event handling ! gnaaaaa !!! [@](src/handler/event/handle-popstate.js#30) [@](src/handler/event/handle-popstate.js#73) [@](src/router/router.js#43)

- [x] shared

  - [x] load 'message-tmpl-contacts-info' in /shared route when it's the landing page view
  - [x] remove attribute class 'is-transparent' from ContactItem when redirected from /chat or clean attributes _before_ (?) caching awaited/promised ContacItem components
  - [x] remove all needless elements (e.g. span#message-pending-indicator) _before_ caching promised ContactItem components

- [x] send user to a new route to send a message and when the message was send. Implies to remove 'renderer-page.js' and use the custom component ChatModule in every route: /chat, /shared, /message, /processed (or url param) and /about.

  - [x] use a contact state to

    - [x] redirect to /error from /contact/message when `requiredEmailValue === null`
    - [x] redirect to /error from /contact/captcha when `requiredEmailValue === null`
    - [ ] ~~redirect to /error when /processed when `processing === null`~~

  - [x] route validation
  - [x] `handleSubmit()`

- [x] create handler/errorHandler
- [x] move data/index.js => handler/dataHandler, move formHandler (?)
- [x] formController.js

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
  - [x] adjust attribute 'cols' in 'resized' event
  - [x] pass data key from button to contactHandler !
  - [x] refactor data and dataHandler => add property 'tags' which is associated with the loaded .html-file (requires updating renderer)
  - [ ] security: sanitize textarea.value
  - [x] render dynamic ChatMessage contents
  - [x] captcha-validator
  - [ ] doublecheck css: disable resizable textarea (?)

- [x] share - restructure or rewrite
  - [x] remove link to preview from options and add it as a chat message
  - [ ] ~~add QRCode image - add npm pkg~~
  - [ ] Share API / navigator.canShare / Permissions [@](src/listener/button-handler.js)
  - [x] Copy URL

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
- [x] doublecheck possible cases
- [ ] refactor ChatLink setters [@](src/components/chat-module/utils.js#142)

#### ~~ContactItem~~ => ContacList

- [x] ChatContactItem component
- [x] convert characters to html entities in title
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
- [x] finish all pending animation in popstate event
- [x] deactive animations in /shared route when router.hasChanged
- [x] update 'renderAllElements()' animation and doublecheck in each route
- [x] fade ChatLink components in after elements have been removed
- [x] promisify animation (fadeChatLinksIn) has ended before displaying loaded contacts
- [x] change `renderer.transition`. it should be a property of `animation`
- [ ] add css attribute to reset pointer while `renderer.transition === true` [@](src/renderer/renderer.js#43)
- [ ] move `isMobileDevice`. it could be a property of 'renderer'
- [ ] add scroll event listener (?!?!) to be able to control scroll animations (scrollIntoView) [@](src/renderer/removeElements.js#31)

### Refactor

- [x] chained animation promises
- [x] themes [css](src/style/theme.css#100)
- [x] renderer/renderElements.js `checkCurrentStep(step, next)`
- [ ] code splitting
- [ ] collect util functions
  - [ ] delay [@](src/renderer/animation/utils.js)
  - [x] setBooleanAttribute()
- [ ] playAnimations [@](src/renderer/animation/animator.js#150)
- [ ] bug: 'elt is not defined' in createAnimation createFadeOutAnimation when moving forward in history (popstate event) twice
- [ ] bug: /chat : history.forward() : /chat/contacts : history.forward() : /chat/contacts/share doesn't interrupt fade In Animation of /chat/contacts; fade in is played twice
