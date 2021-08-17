import { useEffect, useMemo, useState } from 'react'

import fire from '@/config/fire-config'
import { defaultUserConfig } from '@/config/settings'
import createPersistedState from 'use-persisted-state'

const useUserState = createPersistedState('user')

export const initUser = async uid => {
  const { id } = await getUserInfoByUID(uid)

  !id &&
    fire.firestore().collection('users').add({
      userID: uid,
      stockList: [],
      watchList: [],
      etfList: [],
      boughtList: []
    })
}

export const updateUserData = (docId, data) => {
  return fire
    .firestore()
    .collection('users')
    .doc(docId)
    .set(data, { merge: true })
}

export const addToUserList = (docId, ticker, handleList) => {
  return fire
    .firestore()
    .collection('users')
    .doc(docId)
    .update({
      [handleList]: fire.firestore.FieldValue.arrayUnion(ticker)
    })
}

export const delFromUserList = (docId, ticker, handleList) => {
  return fire
    .firestore()
    .collection('users')
    .doc(docId)
    .update({
      [handleList]: fire.firestore.FieldValue.arrayRemove(ticker)
    })
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

export const getHighlightWatchList = async () => {
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

export const usePersistedUser = () => {
  const [user, setUser] = useState(null)
  const [persistedUser] = useUserState(null)

  useEffect(() => {
    setUser(persistedUser)
  }, [persistedUser])

  return user
}

export const useUser = () => {
  const [user, setUser] = useUserState(null)

  useEffect(() => {
    const sub = fire.auth().onAuthStateChanged(user => {
      setUser(user)
    })

    return sub
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [user, setUser]
}

export const useUserData = user => {
  const [data, setData] = useState(null)
  const defaultUserData = useMemo(
    () => ({
      stockList: [],
      etfList: [],
      watchList: []
    }),
    []
  )

  useEffect(() => {
    if (!user) {
      setData(null)
      return
    }

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
  }, [defaultUserData, user])

  return data
}
