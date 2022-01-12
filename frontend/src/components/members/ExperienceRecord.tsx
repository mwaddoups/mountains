import React from "react";
import tw from "twin.macro";
import { Experience } from "../../models";

interface ExperienceRecordProps {
  experiences: Array<Experience>;
}

const exp_levels = {
  0: 'No Experience',
  1: 'Beginner (0-5 days)',
  2: 'Competent (5-20 days)',
  3: 'Experienced (20+ days)',
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

export default function ExperienceRecord({ experiences }: ExperienceRecordProps) {
  const activitySet = Object.entries(activities).map( ([key, activity]) => {
    const matchingExperience = experiences.find(exp => exp.activity === key);
    
    return (
      <React.Fragment key={key}>
        <ExperienceValue>{activity}</ExperienceValue>
        {matchingExperience
          ? <ExperienceValue>{exp_levels[matchingExperience.competency]}</ExperienceValue>
          : <ExperienceValueMissing>No record.</ExperienceValueMissing>
        }
        {matchingExperience
          ? <ExperienceValue>{matchingExperience.info}</ExperienceValue>
          : <ExperienceValueMissing>No record.</ExperienceValueMissing>
        }
      </React.Fragment>
    )
  })

  return (
    <div className="grid grid-cols-3 my-2">
      <ExperienceHeader>Activity</ExperienceHeader>
      <ExperienceHeader>Experience</ExperienceHeader>
      <ExperienceHeader>Other Info</ExperienceHeader>
      {activitySet}

    </div>
  )
}

const ExperienceHeader = tw.span`text-sm uppercase text-gray-500 font-bold`
const ExperienceValue = tw.span`text-sm my-1`
const ExperienceValueMissing = tw(ExperienceValue)`text-gray-500 italic`