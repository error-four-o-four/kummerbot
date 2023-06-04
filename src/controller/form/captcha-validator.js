export default {
  required: null,
  submitted: null,
  index: 0,
  messages: [
    'Leider nein.',
    'Nope!',
    'Nö',
    'Kann es sein, dass du kein Mensch bist?',
  ],
  get message() {
    this.index = (this.index + 1) % this.messages.length;
    return this.messages[this.index - 1];
  },
  onInput(e) {
    this.submitted = e.target.valueAsNumber;
  },
  isValid() {
    return this.required === this.submitted;
  },
};
