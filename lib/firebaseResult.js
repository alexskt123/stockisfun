import { useEffect, useState } from 'react'
import fire from '../config/fire-config'
import { defaultUserConfig } from '../config/settings'

export const setHistory = async ticker => {
  const myTimestamp = fire.firestore.Timestamp.now().toDate()

  const data = {
    ticker: ticker,
    time: myTimestamp
  }

  fire.firestore().collection('history').add(data)

  const increment = fire.firestore.FieldValue.increment(1)

  fire
    .firestore()
    .collection('history')
    .doc('summary')
    .set({ [ticker]: increment }, { merge: true })
}

export const initUser = async uid => {
  const { id } = await getUserInfoByUID(uid)

  if (!id) {
    fire.firestore().collection('users').add({
      userID: uid,
      stockList: [],
      watchList: [],
      etfList: [],
      boughtList: []
    })
  }
}

export const updUserAllList = async (
  uid,
  { stockList, etfList, watchList }
) => {
  const { id } = await getUserInfoByUID(uid)

  await fire
    .firestore()
    .collection('users')
    .doc(id)
    .set(
      {
        stockList: [...stockList],
        etfList: [...etfList],
        watchList: [...watchList]
      },
      { merge: true }
    )
}

export const updUserBoughtList = async (uid, boughtList) => {
  const { id } = await getUserInfoByUID(uid)

  await fire
    .firestore()
    .collection('users')
    .doc(id)
    .set(
      {
        boughtList: [...boughtList]
      },
      { merge: true }
    )
}

export const updUserWatchList = async (uid, watchList) => {
  const { id } = await getUserInfoByUID(uid)

  await fire
    .firestore()
    .collection('users')
    .doc(id)
    .set(
      {
        watchList: [...watchList]
      },
      { merge: true }
    )
}

export const addToUserList = async (uid, ticker, handleList) => {
  const { id, stockList, etfList } = await getUserInfoByUID(uid)
  const userList = handleList == 'stock' ? stockList : etfList

  if (!userList.includes(ticker)) {
    const newUserList =
      handleList == 'stock'
        ? { stockList: [...userList, ticker] }
        : { etfList: [...userList, ticker] }
    await fire
      .firestore()
      .collection('users')
      .doc(id)
      .set(
        {
          ...newUserList
        },
        { merge: true }
      )
  }
}

export const delFromUserList = async (uid, ticker, handleList) => {
  const { id, stockList, etfList } = await getUserInfoByUID(uid)
  const userList = handleList == 'stock' ? stockList : etfList
  const newUserList =
    handleList == 'stock'
      ? { stockList: [...userList.filter(x => x != ticker)] }
      : { etfList: [...userList.filter(x => x != ticker)] }

  await fire
    .firestore()
    .collection('users')
    .doc(id)
    .set(
      {
        ...newUserList
      },
      { merge: true }
    )
}

export const getUserInfoByUID = async uid => {
  const stockSnapShot = await fire
    .firestore()
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

export const getEmailByID = async id => {
  const emailSnapShot = await fire
    .firestore()
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

export const getHighlistWatchList = async () => {
  const watchListSnapShot = fire
    .firestore()
    .collection('settings')
    .doc('highlightWatchList')

  const doc = await watchListSnapShot.get()

  return doc.data()
}

export const getEmailsByCategory = async category => {
  const usersSnapShot = await fire
    .firestore()
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
  const usersSnapShot = await fire.firestore().collection('users').get()

  const dataSet = []

  usersSnapShot.forEach(doc => {
    dataSet.push({ ...doc.data() })
  })

  return dataSet
}

export const useUser = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const sub = fire.auth().onAuthStateChanged(user => {
      setUser(user)
    })

    return sub
  }, [])

  return user
}

const defaultUserData = {
  stockList: [],
  etfList: [],
  watchList: []
}

export const useUserData = user => {
  const [data, setData] = useState(defaultUserData)

  useEffect(() => {
    if (!user) return
    const db = fire.firestore()

    const sub = db
      .collection('users')
      .where('userID', '==', user.uid)
      .limit(1)
      .onSnapshot(snap => {
        const doc = snap.docs.find(x => x)
        const result = {
          ...defaultUserData,
          docId: doc?.id,
          ...doc?.data()
        }

        setData(result)
      })

    return sub
  }, [user])

  return data
}
