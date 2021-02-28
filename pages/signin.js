
import { Fragment, useState, useEffect } from 'react'
import CustomContainer from '../components/Layout/CustomContainer'
import dynamic from "next/dynamic";

const DynamicAuthForm = dynamic(
  () => {
    return import('../components/AuthForm');
  },
  { ssr: false }
);


export default function Home() {
    const [showAuth, setShowAuth] = useState(false)

    useEffect(() => {
        if (window && window.location) {
            setShowAuth(true)
        }
    }, [])

    return (
        <Fragment>
            <CustomContainer style={{ minHeight: '100vh' }}>
                <Fragment>
                    {showAuth ? <DynamicAuthForm /> : ''}
                </Fragment >
            </CustomContainer>
        </Fragment >
    )
}
