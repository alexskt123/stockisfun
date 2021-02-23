import fire from '../config/fire-config'

export const setHistory = async (ticker) => {
  const myTimestamp = fire.firestore.Timestamp.now().toDate()

  const data = {
    ticker: ticker,
    time: myTimestamp
  }

  fire.firestore()
    .collection('history')
    .add(data)

  const increment = fire.firestore.FieldValue.increment(1)

  fire.firestore()
    .collection('history')
    .doc('summary')
    .set({ [ticker]: increment }, { merge: true })
}

export const getEmailByID = async (id) => {
  const emailSnapShot = await fire.firestore()
    .collection('email')
    .where('id', '==', id)
    .limit(1)
    .get()

  const dataSet = []

  emailSnapShot.forEach(doc => {
    dataSet.push({ ...doc.data() })
  })

  return dataSet
}

export const getEmailsByCategory = async (category) => {
  const usersSnapShot = await fire.firestore()
    .collection('email')
    .where('category', '==', category)
    .get()

  const dataSet = []

  usersSnapShot.forEach(doc => {
    dataSet.push({ ...doc.data() })
  })

  return dataSet
}


export const getUsers = async () => {
  const usersSnapShot = await fire.firestore()
    .collection('users')
    .get()

  const dataSet = []

  usersSnapShot.forEach(doc => {
    dataSet.push({ ...doc.data() })
  })

  return dataSet
}
