# todos

- [ ] consider using a default error message [@](src/controller/error-controller.js)
- [ ] ~~ContactList component error~~ error handling is not required because the contacts aren't imported asynchronous at the moment => consider using dynamic import()
- [ ] doublecheck href of linkBack in /error when mesage could not be send (router.replcae ??)

- [x] doublecheck href vs pathname ChatLink.update() and router
- [ ] doublecheck when user clicked on historyLink but history.state.index === 0 => router.js historyUnshiftState() await timeout (?)

- [x] update document.title
- [ ] alert user when user clicked on link to contact route if message has not been send yet (!!messageForm.textarea.value)
- [x] Share API / navigator.canShare / Permissions
  - [x] chrome
  - [ ] android
  - [ ] iphone
- [ ] security: sanitize textarea.value

- [ ] popstate event handling ! gnaaaaa !!! [@](src/handler/event/handle-popstate.js#30) [@](src/handler/event/handle-popstate.js#73) [@](src/router/router.js#43)
  - [x] hide captchaForm
  - [ ] doublecheck when `history.state.isfirstPage` should be set
  - [x] consider ~~setting `router.hasChanged` as a property of history.state to use it in popstate events~~ doublecheck in renderer, compare pathname.length, set router.hasChanged (case: go to /chat (home))
  - [x] /about => 'zurück': /contact/message => history.forward() (/about) didn't call renderer.update()
  - [ ] /contact/requesting => pop back: alert() or prevent
  - [ ] /chat : history.forward() : /chat/contacts : history.forward() : /chat/contacts/share doesn't interrupt fade In Animation of /chat/contacts; fade in is played twice ???

### Renderer / Animation

- [ ] create/use a svg factory (cross browser! ChatLink icons)
- [ ] Loading Indicator on Page when it's the first/initial render and the html hasn't been fetched yet => use `router.hasChanged` and `router.hasPopped`
- [ ] indicate when a url/mail has been copied
- [ ] use scrollToTop in `removeAllElements()`
- [x] doublecheck renderer.hasPopped to decide if `removeAllElements()` vs `removeElements()` should be called
- [x] render immediately when cached / popstate forward ?

### Styles

- [ ] add css attribute to reset pointer while `renderer.transition === true` [@](src/renderer/renderer.js#43)
- [ ] doublecheck css: disable resizable textarea (?)
- [ ] chat-module/utils.js "@refactor styles 'is-hidden' @consider do not add any class attributes'" (?)

### Optional

- [ ] code splitting
- [ ] add scroll event listener (?!?!) to be able to control scroll animations (scrollIntoView) [@](src/renderer/removeElements.js#31)

### Refactor

- [ ] collect util functions
- [ ] playAnimations [@](src/renderer/animation/animator.js#150)
- [ ] move `isMobileDevice`. it could be a property of 'renderer'
- [ ] refactor ChatLink setters [@](src/components/chat-module/utils.js#142)

### Bug

- [ ] 'elt is not defined' in createAnimation createFadeOutAnimation when moving forward in history (popstate event) twice
- [x] use pushState when routing from /contact/message to /about
- [x] error message is not displayed in /contact/responded
