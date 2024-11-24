interface BankDetails {
  accountNumber: string | null;
  bankName: string | null;
  routingNumber: string | null;
}

export interface role{
  id: number;
  name: string;
}

 export interface UserDetailsItem {
    id: number;
    KeyCloakID: string;
    Username: string;
    FirstName: string;
    LastName: string;
    Address: string;
    Email: string;
    Phone: string;
    Whatsapp: string;
    Country: string;
    City: string;
    VerificationCode: string | null;
    Bio: string;
    Paypal: string | null;
    ProfilePictureURL: string;
    DateOfBirth: string | null;
    Role: string;
    Status: string;
    NotificationSettings: string | null;
    BankDetails: BankDetails | null;
    Provider: string;
    CreatedAt: string;
    UpdatedAt: string;
    role : role
}


  interface Meta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  }

  export  interface GetTpAndspiResponse {
    data: {
      items: UserDetailsItem[];
      meta: Meta;
    };
    message: string;
  }


  export interface UserRoles {
    id: number;
    name: string;
    userCount : number;
  }

  interface Meta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  }

  export  interface GetRolesResponse {
    data: {
      items: UserRoles[];
      meta: Meta;
    };
    message: string;
  }


  export  interface GetUserDetailsResponse {
    data: {
      items: UserDetailsItem[];
      meta: Meta;
    };
    message: string;
  }