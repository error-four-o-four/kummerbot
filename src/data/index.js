let contacts;

async function resolver(fn) {
  console.log('resolving');
  const data = await import('./contacts.js');
  fn(data.default);
}

export async function getContact(key) {
  const filter = (item) => key === item.title;

  if (!contacts) {
    return new Promise(resolver).then((data) => {
      contacts = data;
      return data.filter(filter)[0] || null;
    });
  }

  return contacts.filter(filter)[0] || null;
}

// export async function getContacts(...keys) {
// 	const filter = item => keys.includes(item.title);

// 	if (!contacts) {
// 		return new Promise(resolver).then((data) => {
// 			contacts = data;
// 			return data.filter(filter);
// 		})
// 	}

// 	return contacts.filter(filter);
<<<<<<< HEAD
// }
=======
// }
>>>>>>> d909d69 (wip: contacts list)
