import dateFormat from "dateformat";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { getName } from "../methods/user";
import { Activity } from "../models";
import { Bolded, Heading, Paragraph, Section } from "./base/Base";
import Loading from "./Loading";

export default function ActivityLog() {
  let [activities, setActivities] = useState<Array<Activity>>([])
  let [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`activity/`).then(res => {
      setActivities(res.data);
      setLoading(false);
    })
  }, [])

  return (
    <Section>
      <Heading>Activity Log</Heading>
      <Loading loading={loading}>
        {activities.map(activity => (
          <Paragraph key={activity.id}>
            <span className="text-gray-500">{dateFormat(activity.timestamp, "dd mmm HH:MM")}</span> 
            <Bolded>{" " + getName(activity.user)}</Bolded> {activity.action} 
            {activity.event 
              ? <Link to={`../events/${activity.event?.id}`} className="text-blue-700 hover:text-blue-500">
                {` ${activity.event.title} (${dateFormat(activity.event.event_date, "mmm dS")})`}
                </Link>
              : ""}
          </Paragraph>
        ))}
      </Loading>
    </Section>
  )
}