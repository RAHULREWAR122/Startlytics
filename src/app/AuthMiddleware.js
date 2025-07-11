// 'use client'
// import { NextResponse } from 'next/server'
// import { useSelector , useDispatch } from 'react-redux'
// import { loadUserFromLocalStorage , loadTokenFromLocalStorage } from '@/components/Redux/AuthSlice'

// export function middleware(request) {
//    const dispatch = useDispatch();
//    const token = useSelector((state)=>state?.userLocalSlice.token)
//    const userData = useSelector((state)=>state?.userLocalSlice.user)
     
  
//     useEffect(()=>{
//         dispatch(loadTokenFromLocalStorage())
//         dispatch(loadUserFromLocalStorage())
//     },[dispatch]) 

  
//   if (!token && !userData) {
//     return NextResponse.redirect(new URL('/', request.url))
//   }
  
//   return NextResponse.next()
// }

// export const config = {
//   matcher: ['/csvupload/:path*', '/dashboard/:path*' , '/googlesheet/:path*' , '/profile:/path*']
// }