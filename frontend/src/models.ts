export type User = {
  id: number,
  url: string,
  first_name: string,
  last_name: string,
  profile_picture: string | undefined,
  is_approved: boolean,
}

export type Experiences = {
  hillwalking: number,
}

export interface FullUser extends User {
  mobile_number: string,
  about: string,
  experience: Experiences | null
}


export type Event = {
  id: number,
  title: string,
  created_date: string,
  event_date: string,
  description: string,
  attendees: Array<User>,
  max_attendees: number | null,
  organiser: User | null,
}

export type FeedPost = {
  id: number,
  url: string,
  user: User,
  posted: string,
  text: string,
  comments: Array<Comment>,
}

export type Comment = {
  id: number,
  post_id: string,
  user: User,
  posted: string,
  text: string,
}

export type AuthContext = { 
  authToken: string | null,
  currentUser: User | null,
  storeAuth: (a: string | null) => void,
  logout: () => void,
}