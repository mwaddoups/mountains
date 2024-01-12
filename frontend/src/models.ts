// This should not be changed very often!!
export type NamedProfileUser = {
  id: number,
  first_name: string,
  last_name: string,
  profile_picture: string | undefined,
}

export interface User extends NamedProfileUser {
  url: string,
  is_approved: boolean,
  is_committee: boolean,
  is_walk_coordinator: boolean,
  is_paid: boolean,
  mobile_number: string,
  in_case_emergency: string | undefined;
  is_on_discord: boolean,
  is_winter_skills: boolean,
}

export interface AttendingUser extends NamedProfileUser {
  au_id: number,
  is_approved: boolean,
  is_committee: boolean,
  is_walk_coordinator: boolean,
  is_paid: boolean,
  mobile_number: string,
  in_case_emergency: string | undefined;
  is_on_discord: boolean,
  is_waiting_list: boolean,
  is_trip_paid: boolean,
  list_join_date: string,
}

export interface FullUser extends User {
  about: string;
  experience: Array<Experience> | null;
  email: string;
}

export interface CommitteeUser extends NamedProfileUser {
  committee_role: "President" | "Secretary" | "Treasurer" | "General" | undefined,
  committee_bio: string,
}

export type Experience = {
  activity: "HW" | "WW" | "SC" | "IC" | "IB" | "OS" | "OT" | "WC" | "ST",
  competency: (0 | 1 | 2 | 3),
  info: string | undefined,
}

// If changing this, change eventType dict (client) and server
export type EventType = 'SD' | 'SW' | 'WD' | 'WW' | 'CL' | 'SO' | 'CM' | 'XX'

export type BasicEvent = {
  id: number,
  title: string,
  event_date: string,
  event_type: EventType,
  is_deleted: boolean,
}

export interface Event extends BasicEvent {
  created_date: string,
  description: string,
  attendees: Array<AttendingUser>,
  max_attendees: number,
  organiser: User,
  show_popup: boolean,
  members_only: boolean,
  signup_open: boolean,
  is_deleted: boolean,
  signup_open_date: string | null,
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
  starred: boolean,
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

export type Activity = {
  id: number,
  user: NamedProfileUser,
  action: string,
  timestamp: string,
  event: BasicEvent | null,
}

export type Report = {
  id: number,
  title: string,
  report_date: string,
  header_image: string,
}

export interface FullReport extends Report {
  content: string
}