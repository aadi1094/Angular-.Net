import { HttpInterceptorFn, HttpHandlerFn, HttpRequest } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // Get token from local storage
  const token = localStorage.getItem('auth_token');
  
  // If token exists, clone the request and add the authorization header
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }
  
  // Otherwise, proceed with the original request
  return next(req);
};

