import fire from '../config/fire-config'
import { defaultUserConfig } from '../config/settings'

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

export const initUser = async (uid) => {
  const { id } = await getUserInfoByUID(uid)

  if (!id) {
    fire.firestore().collection('users').add({
      userID: uid,
      stockList: [],
      watchList: []
    })
  }
}

export const updUserWatchList = async (uid, watchList) => {
  const { id } = await getUserInfoByUID(uid)

  await fire.firestore().collection('users').doc(id).set({
    watchList: [...watchList]
  }, { merge: true })

}

export const addToUserStockList = async (uid, ticker) => {
  const { id, stockList } = await getUserInfoByUID(uid)

  if (!stockList.includes(ticker))
    await fire.firestore().collection('users').doc(id).set({
      stockList: [...stockList, ticker]
    }, { merge: true })

}

export const delFromUserStockList = async (uid, ticker) => {
  const { id, stockList } = await getUserInfoByUID(uid)

  await fire.firestore().collection('users').doc(id).set({
    stockList: [...stockList.filter(x => x != ticker)]
  }, { merge: true })

}

export const getUserInfoByUID = async (uid) => {
  const stockSnapShot = await fire.firestore()
    .collection('users')
    .where('userID', '==', uid)
    .limit(1)
    .get()

  let dataSet = { ...defaultUserConfig }

  stockSnapShot.forEach(doc => {
    dataSet = { ...dataSet, ...doc.data(), id: doc.id }
  })

  return dataSet
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
