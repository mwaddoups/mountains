export type User = {
  id: number,
  url: string,
  first_name: string,
  last_name: string,
  profile_picture: string | undefined,
  is_approved: boolean,
  is_committee: boolean,
  is_paid: boolean,
  mobile_number: string,
  in_case_emergency: string | undefined;
}

export type Experience = {
  activity: "HW" | "WW" | "SC" | "IC" | "IB" | "OS" | "OT" | "WC" | "ST",
  competency: (0 | 1 | 2 | 3),
  info: string | undefined,
}

export interface FullUser extends User {
  about: string;
  experience: Array<Experience> | null;
  email: string;
}

export type AttendingUserData = {
  is_waiting_list: boolean,
}

export interface AttendingUser extends User {
  au_data: AttendingUserData;
}

export type CommitteeUser = {
  id: number,
  first_name: string,
  last_name: string,
  profile_picture: string | undefined,
  committee_role: "President" | "Secretary" | "Treasurer" | "General" | undefined,
  committee_bio: string,
}

export type Event = {
  id: number,
  title: string,
  created_date: string,
  event_date: string,
  description: string,
  attendees: Array<AttendingUser>,
  max_attendees: number | null,
  organiser: User,
  show_popup: boolean,
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

export type Photo = {
  id: number,
  uploader: User,
  uploaded: string,
  photo: string,
}

export type Album = {
  id: number,
  name: string,
  event_date: string,
  created: string,
  photos: Array<Photo>,
  contributors: Array<User>
}

export type AuthContext = { 
  authToken: string | null,
  currentUser: FullUser | null,
  refreshUser: () => void,
  storeAuth: (a: string | null) => void,
  logout: () => void,
}