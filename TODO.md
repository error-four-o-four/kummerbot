# todos

- [ ] consider using a default message [@](src/controller/error-controller.js)
- [ ] doublecheck each route when it's the landing page
- [ ] doublecheck possible error cases

  - [ ] /contact route is first view
  - [ ] ContactList component error
  - [ ] `handleLinkToContact()` use replaceState when the contact data can not be found => /error

- [ ] doublecheck ChatLink **back** in each route (use historyController/router.prevroute)

  - [ ] chat
  - [ ] shared
  - [ ] about
  - [ ] error
  - [ ] contact

- [ ] doublecheck ChatLink **home** in each route

  - [ ] chat
  - [ ] shared
  - [ ] about
  - [ ] error
  - [ ] contact

- [ ] Share API / navigator.canShare / Permissions [@](src/listener/button-handler.js)
- [ ] security: sanitize textarea.value
- [ ] popstate event handling ! gnaaaaa !!! [@](src/handler/event/handle-popstate.js#30) [@](src/handler/event/handle-popstate.js#73) [@](src/router/router.js#43)
  - [ ] hide captchaForm
  - [ ] doublecheck when `history.state.isfirstPage` should be set
  - [ ] consider setting `router.hasChanged` as a property of history.state to use it in popstate events

### Renderer / Animation

- [ ] create/use a svg factory (cross browser! ChatLink icons)
- [ ] Loading Indicator on Page when it's the first/initial render and the html hasn't been fetched yet => use `router.hasChanged` and `router.hasPopped`
- [ ] use scrollToTop in `removeAllElements()`
- [ ] doublecheck when `removeAllElements()` vs `removeElements()` should be called

### Styles

- [ ] add css attribute to reset pointer while `renderer.transition === true` [@](src/renderer/renderer.js#43)
- [ ] doublecheck css: disable resizable textarea (?)
- [ ] chat-module/utils.js "@refactor styles 'is-hidden' @consider do not add any class attributes'" (?)

### Optional

- [ ] code splitting
- [ ] add scroll event listener (?!?!) to be able to control scroll animations (scrollIntoView) [@](src/renderer/removeElements.js#31)

### Refactor

next)`

- [ ] collect util functions
- [ ] playAnimations [@](src/renderer/animation/animator.js#150)
- [ ] move `isMobileDevice`. it could be a property of 'renderer'
- [ ] refactor ChatLink setters [@](src/components/chat-module/utils.js#142)

### Bug

- [ ] 'elt is not defined' in createAnimation createFadeOutAnimation when moving forward in history (popstate event) twice
- [ ] /chat : history.forward() : /chat/contacts : history.forward() : /chat/contacts/share doesn't interrupt fade In Animation of /chat/contacts; fade in is played twice ???
- [ ] back button doesn't work when routed from /contact => /about =/=> /contact
- [ ] use pushState when routing from /contact/message to /about
- [ ] error message is not displayed in /contact/responded
