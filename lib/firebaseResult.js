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
      watchList: [],
      etfList: []
    })
  }
}

export const updUserWatchList = async (uid, watchList) => {
  const { id } = await getUserInfoByUID(uid)

  await fire.firestore().collection('users').doc(id).set({
    watchList: [...watchList]
  }, { merge: true })

}


export const addToUserList = async (uid, ticker, handleList) => {
  const { id, stockList, etfList } = await getUserInfoByUID(uid)
  const userList = handleList == 'stock' ? stockList : etfList

  if (!userList.includes(ticker)) {
    const newUserList = handleList == 'stock' ? { stockList: [...userList, ticker] } : { etfList: [...userList, ticker] }
    await fire.firestore().collection('users').doc(id).set({
      ...newUserList
    }, { merge: true })
  }

}

export const delFromUserList = async (uid, ticker, handleList) => {
  const { id, stockList, etfList } = await getUserInfoByUID(uid)
  const userList = handleList == 'stock' ? stockList : etfList
  const newUserList = handleList == 'stock' ? { stockList: [...userList.filter(x => x != ticker)] } : { etfList: [...userList.filter(x => x != ticker)] }

  await fire.firestore().collection('users').doc(id).set({
    ...newUserList
  }, { merge: true })

}

export const getUserInfoByUID = async (uid) => {
  const stockSnapShot = await fire.firestore()
    .collection('users')
    .where('userID', '==', uid)
    .limit(1)
    .get()

  const userList = []
  stockSnapShot.forEach(doc => {
    userList.push({ ...defaultUserConfig, ...doc.data(), id: doc.id })
  })

  const dataSet = userList.find(x => x) || { ...defaultUserConfig }

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
