import React, {useState, useEffect} from 'react'
import UserApi from '../api';

//useFetch hook to fetch data from backend

const useFetch = (url, options) => {
    const [response, setResponse] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await UserApi.get(url, options)
                const json = await res.json()
                setResponse(json)
                setLoading(false)
            } catch (error) {
                setError(error)
            }
        }
        fetchData()
    }, [])
    return {response, error, loading}
}

export default useFetch
