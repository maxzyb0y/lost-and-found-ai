"""Authentication dependency: resolve the current user from a Bearer JWT."""
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.user import User
from .security import decode_access_token

bearer_scheme = HTTPBearer(auto_error=True)

_credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    try:
        payload = decode_access_token(credentials.credentials)
        subject = payload.get("sub")
        if subject is None:
            raise _credentials_exception
        user_id = int(subject)
    except (jwt.PyJWTError, ValueError, TypeError):
        raise _credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise _credentials_exception
    return user
