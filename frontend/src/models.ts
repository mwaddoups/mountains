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
  is_site_admin: boolean,
  is_walk_coordinator: boolean,
  is_paid: boolean,
  is_dormant: boolean,
  membership_expiry: string,
  mobile_number: string,
  in_case_emergency: string | undefined;
  is_on_discord: boolean,
  is_winter_skills: boolean,
  discord_id: string,
}

export interface AttendingUser extends NamedProfileUser {
  au_id: number,
  is_approved: boolean,
  is_committee: boolean,
  is_walk_coordinator: boolean,
  membership_expiry: string,
  mobile_number: string,
  is_paid: boolean,
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
export type EventType = 'SD' | 'SW' | 'WD' | 'WW' | 'CL' | 'OC' | 'RN' | 'SO' | 'CM' | 'XX'

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
  is_open: boolean,
  price_id: string | null,
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
export type SmallKit = {
  id: number,
  text_id: string,
  description: string,
}

export interface Kit extends SmallKit {
  id: number
  text_id: string,
  description: string,
  brand: string,
  color: string,
  type: string,
  purchased_on: string,
  added_on: string,
  seller: string,
  price: number,
  last_checked: string,
  last_condition: string,
  notes: string | null,
}

export type KitBorrow = {
  id: number
  kit: SmallKit,
  user: User,
  request_date: string,
  start_date: string,
  end_date: string,
  collection_details: string,
  is_approved: boolean,
}