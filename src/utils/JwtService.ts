import { jwtDecode } from "jwt-decode";
export interface JwtPayload{
    userId : string,
}
// interface DecodedToken extends JwtPayload {
//    avatarUrl?: string;
//  }
export function getIdUserByToken() {
    const token = localStorage.getItem('token');
    if (token) {
       const decodedToken = jwtDecode(token) as JwtPayload;
       return decodedToken.userId;
    }
 }

//  export function getAvatarUrl(): string | null {
//    const token = localStorage.getItem('jwtToken');
//    if (token) {
//      const decodedToken = jwtDecode<DecodedToken>(token);
//      return decodedToken.avatarUrl || null;
//    }
//    return null;
//  }
 
//  export function getRoleBytoken(): string | null {
//   const token = localStorage.getItem('jwtToken');
//   if (token) {
//     const decodedToken = jwtDecode<DecodedToken>(token);
//     return decodedToken.role || null;
//   }
//   return null;
// }