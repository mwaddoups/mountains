import React from "react";
import { Experience } from "../../models";

interface ExperienceRecordProps {
  exp: Experience;
}

const exp_levels = {
  0: 'No Experience',
  1: 'Beginner',
  2: 'Competent',
  3: 'Experienced',
}

const activities = {
  'HW': 'Hillwalking',
  'WW': 'Winter Walking',
  'SC': 'Scrambling',
  'IC': 'Indoor Climbing',
  'IB': 'Indoor Bouldering',
  'OS': 'Sport Climbing',
  'OT': 'Trad Climbing',
  'WC': 'Winter Climbing',
  'ST': 'Ski Touring',
}

export default function ExperienceRecord({ exp }: ExperienceRecordProps) {
  const activity = activities[exp.activity];
  const competency = exp_levels[exp.competency];
  return (
    <p>{activity} - {competency} - {exp.info}</p>
  )
}