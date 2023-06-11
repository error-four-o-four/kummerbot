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
    return this.messages[this.index];
  },
  isValid() {
    return this.required === this.submitted;
  },
};
