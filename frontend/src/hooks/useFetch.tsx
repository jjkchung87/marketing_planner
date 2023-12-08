// import React, { useState, useEffect } from 'react';
// import UserApi from '../api';

// // Define a generic type for the response
// type UseFetchResponse<T> = {
//   response: T | null;
//   error: Error | null;
//   loading: boolean;
// };

// // useFetch hook to fetch data from backend
// const useFetch = <T,>(url: string, options: RequestInit): UseFetchResponse<T> => {
//     const [response, setResponse] = useState<T | null>(null);
//     const [error, setError] = useState<Error | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const res = await UserApi.get(url, options);
//                 const json: T = await res.json();
//                 setResponse(json);
//                 setLoading(false);
//             } catch (error) {
//                 setError(error as Error);
//             }
//         };

//         fetchData();
//     }, [url, options]); // Ensure url and options are included in dependency array if they should trigger re-fetch

//     return { response, error, loading };
// };

// export default useFetch;
