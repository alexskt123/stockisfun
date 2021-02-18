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
