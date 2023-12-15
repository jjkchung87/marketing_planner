import React from 'react';
import { CurrentUserType, UserContextType } from '../types/types';


// Create the context with a default value
const UserContext = React.createContext<UserContextType | null>(null);

export default UserContext;

