import { useEffect, useState } from "react";
import api from "../api";
import { getName } from "../methods/user";
import { Activity } from "../models";
import { Heading, Paragraph, Section } from "./base/Base";
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
            {getName(activity.user)} {activity.action} {activity.event?.title || ""}
          </Paragraph>
        ))}
      </Loading>
    </Section>
  )
}